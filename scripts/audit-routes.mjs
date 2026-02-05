
import fs from 'fs';
import path from 'path';

const MANIFEST_PATH = 'docs/mvp-scope.json';
const APP_ROOT = 'apps/web/src/app';
const REPORT_PATH = 'reports/mvp-routes-report.md';

function runAudit() {
    console.log('🔍 Starting Route Audit...');

    if (!fs.existsSync(MANIFEST_PATH)) {
        console.error(`❌ Manifest not found at ${MANIFEST_PATH}`);
        process.exit(1);
    }

    const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'));
    const routes = manifest.routes;

    if (!routes || !Array.isArray(routes)) {
        console.error('❌ Manifest missing "routes" array');
        process.exit(1);
    }

    let passCount = 0;
    let failCount = 0;
    const results = [];

    routes.forEach(route => {
        // Convert route to file path
        // e.g. /[locale]/about -> apps/web/src/app/[locale]/about/page.tsx
        // Special case: /[locale]/ -> apps/web/src/app/[locale]/page.tsx

        let fileRelPath;
        if (route.endsWith('/')) {
            fileRelPath = path.join(APP_ROOT, route, 'page.tsx');
        } else {
            fileRelPath = path.join(APP_ROOT, route, 'page.tsx');
        }

        // Normalize path separators for Windows
        const filePath = path.resolve(process.cwd(), fileRelPath);
        const exists = fs.existsSync(filePath);

        if (exists) {
            passCount++;
            results.push(`| \`${route}\` | \`${fileRelPath}\` | ✅ PASS |`);
        } else {
            failCount++;
            results.push(`| \`${route}\` | \`${fileRelPath}\` | ❌ FAIL |`);
        }
    });

    // Generate Markdown Report
    const reportContent = `# MVP Route Audit Report
**Date:** ${new Date().toISOString()}
**Manifest:** \`${MANIFEST_PATH}\`
**Routes Checked:** ${routes.length}

## Summary
| Status | Count |
| :--- | :--- |
| ✅ PASS | ${passCount} |
| ❌ FAIL | ${failCount} |
| **Total** | **${routes.length}** |

## Detailed Analysis
| Route | Expected File | Status |
| :--- | :--- | :--- |
${results.join('\n')}

<br>

**Result:** ${failCount === 0 ? '✅ ALL ROUTES VERIFIED' : '❌ AUDIT FAILED'}
`;

    // Ensure reports directory exists
    const reportDir = path.dirname(REPORT_PATH);
    if (!fs.existsSync(reportDir)) {
        fs.mkdirSync(reportDir, { recursive: true });
    }

    fs.writeFileSync(REPORT_PATH, reportContent);
    console.log(`📝 Report generated at ${REPORT_PATH}`);

    if (failCount > 0) {
        console.error(`❌ ${failCount} routes missing!`);
        process.exit(1);
    } else {
        console.log('✅ Audit Passed!');
    }
}

runAudit();
