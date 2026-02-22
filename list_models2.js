const https = require('https');
const fs = require('fs');

const API_KEY = "AIzaSyARhZ87Kb3pVtSjpYJnpDQLgO7srniUdXI";
const options = {
    hostname: 'generativelanguage.googleapis.com',
    port: 443,
    path: `/v1beta/models?key=${API_KEY}`,
    method: 'GET'
};

const req = https.request(options, (res) => {
    let data = '';
    res.on('data', (d) => {
        data += d;
    });
    res.on('end', () => {
        if (res.statusCode === 200) {
            const models = JSON.parse(data).models;
            const out = models.map(m => m.name + ' - ' + m.supportedGenerationMethods.join(', ')).join('\n');
            fs.writeFileSync('models.txt', out);
        } else {
            fs.writeFileSync('models.txt', "ERROR: " + data);
        }
    });
});

req.on('error', (error) => {
    console.error(error);
});

req.end();
