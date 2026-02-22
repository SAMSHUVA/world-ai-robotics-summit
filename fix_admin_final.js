const fs = require('fs');
const path = 'c:\\Users\\Shyam\\Website Test\\src\\app\\admin\\page.tsx';
let content = fs.readFileSync(path, 'utf8');

// Use a very broad regex to find the endpointMap object and add blogs: 'blog'
content = content.replace(/'exit feedback':\s*'exit-feedback'/, "'exit feedback': 'exit-feedback',\n                                         blogs: 'blog'");

fs.writeFileSync(path, content);
const verifying = fs.readFileSync(path, 'utf8');
if (verifying.includes("blogs: 'blog'")) {
    console.log('FINAL_SUCCESS');
} else {
    console.log('FINAL_FAILURE');
}
