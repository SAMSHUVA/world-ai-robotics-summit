const fs = require('fs');
const path = 'src/app/admin/page.tsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Fix endpointMap - broader match to handle whitespace
content = content.replace(/'exit feedback':\s*'exit-feedback'/, "'exit feedback': 'exit-feedback',\n                                         blogs: 'blog'");

// 2. Clean up redundant form fields in Admin form
// We'll target the redundant ones after the first set
const redundantStart = content.indexOf('<div className="input-field-wrapper">', content.indexOf('<select name="isPublished" className="price-input" defaultValue={prefillData ? String(prefillData.isPublished) : \'true\'}>') + 10);
const redundantEnd = content.indexOf('</>', redundantStart);

if (redundantStart > -1 && redundantEnd > redundantStart) {
    // Only remove if we find the specific redundant block
    const block = content.substring(redundantStart, redundantEnd);
    if (block.includes('Preview Image URL')) {
        content = content.substring(0, redundantStart) + content.substring(redundantEnd);
    }
}

fs.writeFileSync(path, content);
console.log('Fix applied successfully');
