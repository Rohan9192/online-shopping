const https = require('https');
const fs = require('fs');
const path = require('path');

function searchUnsplashHTML(query) {
  return new Promise((resolve, reject) => {
    https.get(`https://unsplash.com/s/photos/${encodeURIComponent(query)}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        'Accept': 'text/html'
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
             return resolve(null); // handle redirect lazily
        }
        const match = data.match(/<script id="__NEXT_DATA__" type="application\/json">(.*?)<\/script>/);
        if (match) {
           try {
             const json = JSON.parse(match[1]);
             // Extract images from nextjs data
             const photos = [];
             // walk json to find photos
             JSON.stringify(json, (key, value) => {
               if (value && value.id && value.urls && value.urls.raw) {
                 photos.push(value);
               }
               return value;
             });
             resolve(photos);
           } catch(e) { resolve(null); }
        } else {
           resolve(null);
        }
      });
    }).on('error', reject);
  });
}

async function main() {
  const q = 'woman linen shirt fashion';
  console.log('Searching...');
  const photos = await searchUnsplashHTML(q);
  if (photos && photos.length > 0) {
    console.log(photos.slice(0, 5).map(p => p.urls.raw));
  } else {
    console.log('No photos found in HTML.');
  }
}

main();
