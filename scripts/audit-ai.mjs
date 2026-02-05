
import fs from 'fs';
import path from 'path';

const MANIFEST_PATH = 'docs/mvp-scope.json';
const REPORT_PATH = 'reports/mvp-ai-report.md';

const FILES_TO_CHECK = [
    'apps/web/src/lib/ai/registry.ts',
    'apps/web/src/lib/ai/event-bus.ts',
    'apps/web/src/components/ai/AgentSystem.tsx',
    'apps/web/src/components/ai/ClientTrigger.tsx'
];

function runAudit() {
    console.log('🤖 Starting AI Audit...');

    if (!fs.existsSync(MANIFEST_PATH)) {
        console.error(`❌ Manifest not found at ${MANIFEST_PATH}`);
        process.exit(1);
    }

    const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'));
    const expectedAgents = manifest.ai.agents;

    let passCount = 0;
    let failCount = 0;
    const results = [];

    // 1. Check Files
    results.push('### File Existence');
    FILES_TO_CHECK.forEach(file => {
        const filePath = path.resolve(process.cwd(), file);
        if (fs.existsSync(filePath)) {
            passCount++;
            results.push(`| \`${file}\` | ✅ PASS |`);
        } else {
            failCount++;
            results.push(`| \`${file}\` | ❌ FAIL |`);
        }
    });

    // 2. Check Registry Content
    results.push('\n### Agent Registry Verification');
    const registryPath = path.resolve(process.cwd(), 'apps/web/src/lib/ai/registry.ts');

    if (fs.existsSync(registryPath)) {
        const content = fs.readFileSync(registryPath, 'utf8');
        expectedAgents.forEach(agent => {
            if (content.includes(agent)) {
                passCount++;
                results.push(`| Agent: \`${agent}\` | ✅ PASS |`);
            } else {
                failCount++;
                results.push(`| Agent: \`${agent}\` | ❌ FAIL |`);
            }
        });
    } else {
        results.push('| Registry File | ❌ FAIL (Cannot check agents) |');
        failCount += expectedAgents.length;
    }

    // Generate Markdown Report
    const reportContent = `# MVP AI Audit Report
**Date:** ${new Date().toISOString()}
**Manifest:** \`${MANIFEST_PATH}\`

## Summary
| Status | Count |
| :--- | :--- |
| ✅ PASS | ${passCount} |
| ❌ FAIL | ${failCount} |

## Detailed Analysis
| Item | Status |
| :--- | :--- |
${results.join('\n')}

<br>

**Result:** ${failCount === 0 ? '✅ AI SYSTEM VERIFIED' : '❌ AUDIT FAILED'}
`;

    // Ensure reports directory exists
    const reportDir = path.dirname(REPORT_PATH);
    if (!fs.existsSync(reportDir)) {
        fs.mkdirSync(reportDir, { recursive: true });
    }

    fs.writeFileSync(REPORT_PATH, reportContent);
    console.log(`📝 Report generated at ${REPORT_PATH}`);

    if (failCount > 0) {
        console.error(`❌ ${failCount} checks failed!`);
        process.exit(1);
    } else {
        console.log('✅ AI Audit Passed!');
    }
}

runAudit();
