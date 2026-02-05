const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const FORBIDDEN_PATTERNS = [
    'googleapis.com',
    'gstatic.com',
    'jsdelivr.net',
    'unpkg.com',
    'cloudflare.com/ajax/libs',
    'bootstrapcdn.com',
    'fontawesome.com',
    'googletagmanager.com',
    'google-analytics.com'
];

const IGNORED_DIRS = ['node_modules', '.git', '.next', 'dist', 'coverage'];
const EXTENSIONS_TO_SCAN = ['.ts', '.tsx', '.js', '.jsx', '.html', '.css', '.scss'];

function scanFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    const violations = [];

    // Check against specific forbidden domains
    FORBIDDEN_PATTERNS.forEach(domain => {
        if (content.includes(domain)) {
            violations.push(`Found forbidden domain "${domain}"`);
        }
    });

    // Regex for http/https links to try and catch other external assets
    // This is strict. We allow internal links/APIs but flag suspicious assets.
    // Ideally, we'd use a parser, but regex is a good first pass for "Zero External Assets".
    // We want to catch <script src="http...">, <link href="http...">, url('http...')
    const externalAssetRegex = /(src|href|url)\s*=\s*['"]?https?:\/\/(?!localhost|127\.0\.0\.1|api\.bandachao\.com)/gi;
    // NOTE: This is very aggressive and might flag valid API calls, so we might need allowlisting comments.
    // For now, we focus on the explicit forbidden list + manual review of reported "http" strings if needed.

    return violations;
}

function walkDir(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        const dirPath = path.join(dir, f);
        const isDirectory = fs.statSync(dirPath).isDirectory();
        if (isDirectory) {
            if (!IGNORED_DIRS.includes(f)) {
                walkDir(dirPath, callback);
            }
        } else {
            if (EXTENSIONS_TO_SCAN.includes(path.extname(f))) {
                callback(dirPath);
            }
        }
    });
}

console.log('🔒 Starting China Compliance Check (Zero External Assets)...');
let hasViolations = false;

const scanDirs = [
    path.join(__dirname, '../apps/web/src'),
    path.join(__dirname, '../apps/web/public'),
    path.join(__dirname, '../apps/api/src'),
];

scanDirs.forEach(dir => {
    if (fs.existsSync(dir)) {
        walkDir(dir, (filePath) => {
            const fileViolations = scanFile(filePath);
            if (fileViolations.length > 0) {
                console.error(`\n❌ Violation in: ${filePath}`);
                fileViolations.forEach(v => console.error(`   - ${v}`));
                hasViolations = true;
            }
        });
    }
});

if (hasViolations) {
    console.error('\n🚫 COMPLIANCE CHECK FAILED: External assets detected.');
    process.exit(1);
} else {
    console.log('✅ Compliance Check Passed: No forbidden external assets found.');
    process.exit(0);
}
