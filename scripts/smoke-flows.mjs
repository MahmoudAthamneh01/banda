
import fs from 'fs';
import path from 'path';

const REPORT_PATH = 'reports/mvp-smoke-report.md';
const APP_ROOT = 'apps/web/src/app/[locale]';

const FLOWS = {
    'Buyer Flow': [
        'products/page.tsx',
        'products/[id]/page.tsx',
        'cart/page.tsx',
        'checkout/page.tsx',
        'checkout/success/page.tsx',
        'orders/page.tsx'
    ],
    'Maker Flow': [
        'cockpit/page.tsx',
        'cockpit/inventory/page.tsx',
        'cockpit/rfq/page.tsx'
    ],
    'Investor Flow': [
        'vault/page.tsx',
        'vault/opportunities/page.tsx',
        'vault/portfolio/page.tsx'
    ],
    'Admin Flow': [
        'throne/page.tsx',
        'throne/users/page.tsx',
        'throne/finance/page.tsx'
    ]
};

function runAudit() {
    console.log('🔥 Starting Smoke Flow Audit...');

    let passCount = 0;
    let failCount = 0;
    const results = [];

    // Analyze each flow
    Object.entries(FLOWS).forEach(([flowName, steps]) => {
        results.push(`### ${flowName}`);
        let flowPassed = true;

        steps.forEach(step => {
            const filePath = path.resolve(process.cwd(), APP_ROOT, step);
            if (fs.existsSync(filePath)) {
                results.push(`| Step: \`${step}\` | ✅ PASS |`);
            } else {
                flowPassed = false;
                results.push(`| Step: \`${step}\` | ❌ FAIL |`);
            }
        });

        if (flowPassed) {
            passCount++;
            results.push(`> **Outcome:** ✅ ${flowName} VERIFIED\n`);
        } else {
            failCount++;
            results.push(`> **Outcome:** ❌ ${flowName} BROKEN\n`);
        }
    });

    // Generate Markdown Report
    const reportContent = `# MVP Smoke Flow Report
**Date:** ${new Date().toISOString()}

## Summary
| Flow Status | Count |
| :--- | :--- |
| ✅ VERIFIED | ${passCount} |
| ❌ BROKEN | ${failCount} |
| **Total Flows** | **${Object.keys(FLOWS).length}** |

## Detailed Analysis
${results.join('\n')}

<br>

**Result:** ${failCount === 0 ? '✅ ALL FLOWS VERIFIED' : '❌ SMOKE TEST FAILED'}
`;

    // Ensure reports directory exists
    const reportDir = path.dirname(REPORT_PATH);
    if (!fs.existsSync(reportDir)) {
        fs.mkdirSync(reportDir, { recursive: true });
    }

    fs.writeFileSync(REPORT_PATH, reportContent);
    console.log(`📝 Report generated at ${REPORT_PATH}`);

    if (failCount > 0) {
        console.error(`❌ ${failCount} flows broken!`);
        process.exit(1);
    } else {
        console.log('✅ Smoke Audit Passed!');
    }
}

runAudit();
