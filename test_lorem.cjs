const https = require('https');
const fs = require('fs');

https.get('https://loremflickr.com/1920/1080/woman,fashion', (res) => {
  console.log("Status:", res.statusCode);
  console.log("Location:", res.headers.location);
}).on('error', console.error);
