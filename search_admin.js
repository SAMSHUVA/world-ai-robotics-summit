const fs = require('fs');
const path = 'c:\\Users\\Shyam\\Website Test\\src\\app\\admin\\page.tsx';
const content = fs.readFileSync(path, 'utf8');
const lines = content.split('\n');

lines.forEach((line, index) => {
    if (line.includes("blogs: 'blog'")) {
        console.log(`FOUND_AT_LINE_${index + 1}: ${line}`);
    }
});
