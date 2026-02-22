const fs = require('fs');
const path = 'src/app/admin/page.tsx';
let content = fs.readFileSync(path, 'utf8');

const regex = /'exit feedback':\s*'exit-feedback'/;
const match = content.match(regex);
if (match) {
    console.log('Match found:', JSON.stringify(match[0]));
    const newContent = content.replace(regex, match[0] + ",\n                                         blogs: 'blog'");
    fs.writeFileSync(path, newContent);
    console.log('Update written');

    // Verify by reading back
    const verifying = fs.readFileSync(path, 'utf8');
    if (verifying.includes("blogs: 'blog'")) {
        console.log('Verification success: blogs key found');
    } else {
        console.log('Verification failure: blogs key NOT found after write');
    }
} else {
    console.log('No match found for pattern');
}
