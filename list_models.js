const https = require('https');

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
        console.log("STATUS:", res.statusCode);
        if (res.statusCode === 200) {
            const models = JSON.parse(data).models;
            models.forEach(m => console.log(m.name, m.supportedGenerationMethods));
        } else {
            console.log("RESPONSE:", data);
        }
    });
});

req.on('error', (error) => {
    console.error(error);
});

req.end();
