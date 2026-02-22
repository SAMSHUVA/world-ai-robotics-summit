const fs = require('fs');
const path = 'src/app/admin/page.tsx';
let content = fs.readFileSync(path, 'utf8');

// Use a regex that is extremely flexible about quotes and whitespace
const pattern = /'exit feedback':\s*'exit-feedback'/;
if (pattern.test(content)) {
    content = content.replace(pattern, "'exit feedback': 'exit-feedback',\n                                         blogs: 'blog'");
    fs.writeFileSync(path, content);
    console.log('EndpointMap fix applied');
} else {
    // Try double quotes
    const pattern2 = /"exit feedback":\s*"exit-feedback"/;
    if (pattern2.test(content)) {
        content = content.replace(pattern2, '"exit feedback": "exit-feedback",\n                                         blogs: "blog"');
        fs.writeFileSync(path, content);
        console.log('EndpointMap fix applied (double quotes)');
    } else {
        console.log('Could not find endpointMap pattern');
    }
}
