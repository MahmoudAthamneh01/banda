const fs = require('fs');
const path = require('path');

const TARGET_DIR = path.join(__dirname, '../apps/web/src/app/[locale]');

function getAllFiles(dirPath, arrayOfFiles) {
    const files = fs.readdirSync(dirPath);

    arrayOfFiles = arrayOfFiles || [];

    files.forEach(function (file) {
        if (fs.statSync(dirPath + "/" + file).isDirectory()) {
            arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
        } else {
            if (file === 'page.tsx') {
                arrayOfFiles.push(path.join(dirPath, "/", file));
            }
        }
    });

    return arrayOfFiles;
}

function cleanFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // 1. Force remove ApiClient import
    // Matches standard single or double quote imports
    const importRegex = /import\s+{\s*ApiClient\s*}\s+from\s+['"]@\/lib\/api\/client['"];\s*/g;
    if (importRegex.test(content)) {
        content = content.replace(importRegex, '');
        modified = true;
    }

    // 2. Remove unused data/setData state
    const stateRegex = /const\s+\[data,\s+setData\]\s+=\s+useState<any>\(null\);\s*/g;
    if (stateRegex.test(content)) {
        content = content.replace(stateRegex, '');
        modified = true;
    }

    // 3. Comment out setData usage if not already commented
    if (content.includes("setData({ message: 'Mock data loaded' });") && !content.includes("// setData({ message: 'Mock data loaded' });")) {
        content = content.replace("setData({ message: 'Mock data loaded' });", "// setData({ message: 'Mock data loaded' });");
        modified = true;
    }

    if (modified) {
        console.log(`cleaned: ${filePath}`);
        fs.writeFileSync(filePath, content, 'utf8');
    }
}

console.log('Finding files (Aggressive Mode)...');
const files = getAllFiles(TARGET_DIR);
console.log(`Found ${files.length} pages. Cleaning...`);

files.forEach(cleanFile);
console.log('Done.');
