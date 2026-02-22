const http = require('http');
const fs = require('fs');

const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/blog/ai',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    }
};

const req = http.request(options, (res) => {
    let data = '';
    res.on('data', (chunk) => {
        data += chunk;
    });
    res.on('end', () => {
        fs.writeFileSync('error_out.log', `STATUS: ${res.statusCode}\nRESPONSE: ${data}`);
    });
});

req.on('error', (e) => {
    fs.writeFileSync('error_out.log', `REQUEST ERROR: ${e.message}`);
});

req.end();
