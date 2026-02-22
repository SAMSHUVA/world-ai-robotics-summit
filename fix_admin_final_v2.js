const fs = require('fs');
const path = 'c:\\Users\\Shyam\\Website Test\\src\\app\Admin\\page.tsx';
// Wait, the path might be case-sensitive or slightly different. I'll use the one from view_file.
const realPath = 'c:\\Users\\Shyam\\Website Test\\src\\app\\admin\\page.tsx';
let content = fs.readFileSync(realPath, 'utf8');

// 1. Clean up handleDelete mess (remove the multiple blogs: 'blog')
content = content.replace(/blogs: 'blog',\s*blogs: 'blog',\s*blogs: 'blog',\s*blogs: 'blog',\s*/, "");

// 2. Fix the correct endpointMap in onSubmit (around line 1613)
// We look for 'exit feedback': 'exit-feedback' that DOES NOT have blogs after it yet
// And is close to registrations: 'register'
const onSubmitSectionStart = content.indexOf('onSubmit={async (e) =>');
if (onSubmitSectionStart > -1) {
    const onSubmitSection = content.substring(onSubmitSectionStart, content.indexOf('};', onSubmitSectionStart + 500) + 2);
    const updatedSection = onSubmitSection.replace(/'exit feedback':\s*'exit-feedback'/, "'exit feedback': 'exit-feedback',\n                                         blogs: 'blog'");
    content = content.replace(onSubmitSection, updatedSection);
}

fs.writeFileSync(realPath, content);
console.log('CLEANUP_AND_FIX_DONE');
