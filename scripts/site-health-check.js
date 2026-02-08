const fs = require('fs');

const BASE_URL = 'http://localhost:3000';
const ENDPOINTS = [
    { path: '/', name: 'Home Page' },
    { path: '/admin', name: 'Admin Dashboard' },
    { path: '/api/speakers', name: 'API: Speakers' },
    { path: '/api/committee', name: 'API: Committee' },
    { path: '/api/resources', name: 'API: Resources' },
    { path: '/api/sponsors', name: 'API: Sponsors' },
    { path: '/api/coupons', name: 'API: Coupons' },
    { path: '/api/speakers/apply', name: 'API: Speaker Applications' },
    { path: '/api/awards', name: 'API: Awards' },
    { path: '/api/register', name: 'API: Registration' }
];

async function checkHealth() {
    const results = [];
    console.log('Starting Health Check...');

    for (const endpoint of ENDPOINTS) {
        const url = `${BASE_URL}${endpoint.path}`;
        const start = performance.now();
        let status = 'ERROR';
        let duration = 0;
        let note = '';

        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 8000); // 8s timeout to be safe

            const res = await fetch(url, { signal: controller.signal });
            clearTimeout(timeoutId);

            duration = Math.round(performance.now() - start);
            status = res.status;

            if (res.ok) {
                note = '✅ OK';
            } else if (res.status === 401 || res.status === 403) {
                note = '🔒 Auth Required (Pass)'; // Expected for some admin routes if protected
            } else {
                note = `⚠️ Status ${res.status}`;
            }
        } catch (err) {
            duration = Math.round(performance.now() - start);
            status = 'FAIL';
            note = `❌ ${err.message}`;
        }

        console.log(`${endpoint.name}: ${status} (${duration}ms)`);
        results.push({ ...endpoint, status, duration, note });
    }

    // Generate Report
    const timestamp = new Date().toLocaleString();
    let report = `# Website Health Check Report\n\n`;
    report += `**Generated**: ${timestamp}\n`;
    report += `**Environment**: Localhost (Development)\n\n`;
    report += `## System Status\n\n`;
    report += `| Component | Path | Status | Latency | Result |\n`;
    report += `| :--- | :--- | :--- | :--- | :--- |\n`;

    results.forEach(r => {
        report += `| **${r.name}** | \`${r.path}\` | **${r.status}** | ${r.duration}ms | ${r.note} |\n`;
    });

    report += `\n### Execution Summary\n`;
    const successCount = results.filter(r => r.note.includes('OK') || r.note.includes('Auth')).length;
    report += `- **Total Checks**: ${results.length}\n`;
    report += `- **Passing**: ${successCount}\n`;
    report += `- **Issues**: ${results.length - successCount}\n`;

    if (successCount === results.length) {
        report += `\n> ✅ **System is Healthy**. All core endpoints are responsive.\n`;
    } else {
        report += `\n> ⚠️ **Attention Needed**. Some endpoints are failing or slow.\n`;
    }

    fs.writeFileSync('HEALTH_CHECK_REPORT.md', report);
    console.log('Report saved to HEALTH_CHECK_REPORT.md');
}

checkHealth();
