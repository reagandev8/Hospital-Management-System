const http = require('http');

const data = JSON.stringify({
    name: 'Test Bot',
    email: 'bot_' + Date.now() + '@example.com',
    password: 'password123',
    role: 'patient',
    city: 'Bot City',
    address: 'Bot St'
});

const options = {
    hostname: 'localhost',
    port: 5000,
    path: '/api/auth/register',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
    }
};

const req = http.request(options, (res) => {
    let responseBody = '';
    res.on('data', (chunk) => responseBody += chunk);
    res.on('end', () => {
        console.log('Status Code:', res.statusCode);
        console.log('Body:', responseBody);
    });
});

req.on('error', (err) => console.error('Error:', err.message));
req.write(data);
req.end();
