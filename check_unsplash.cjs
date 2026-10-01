const https = require('https');

const urls = [
  'https://unsplash.com/photos/1598554747436-c9293d6a588f',
  'https://unsplash.com/photos/1548624313-0396c75e4b1a',
  'https://unsplash.com/photos/1550639525-c97d455acf70',
  'https://unsplash.com/photos/1515886657613-9f3515b0c78f',
  'https://unsplash.com/photos/1588117305388-c2631a279f82'
];

async function fetchTitle(url) {
  return new Promise((resolve) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const match = data.match(/<title>(.*?)<\/title>/);
        resolve(match ? match[1] : 'No title');
      });
    }).on('error', () => resolve('Error'));
  });
}

async function main() {
  for (const url of urls) {
    console.log(`${url}: ${await fetchTitle(url)}`);
  }
}

main();
