const http = require('http');

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/audit-temp/report',
  method: 'GET',
};

const req = http.request(options, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    try {
      const json = JSON.parse(data);
      console.log(json.markdown);
    } catch (e) {
      console.error('Error parsing JSON:', e.message);
      console.log(data);
    }
  });
});

req.on('error', (error) => {
  console.error('Error:', error.message);
});

req.end();
