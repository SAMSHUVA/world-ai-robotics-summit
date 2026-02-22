const http = require('http');

const options = {
    hostname: 'localhost',
    port: 3002, // The new port
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
        console.log('STATUS:', res.statusCode);
        console.log('RESPONSE:', data);
    });
});

req.on('error', (e) => {
    console.error(`problem with request: ${e.message}`);
});

req.end();
