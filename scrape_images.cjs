const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');
const { searchImages } = require('duck-duck-scrape');

const outputDir = path.join(__dirname, 'public', 'images', 'heroes');

const queries = [
  { file: 'women-shirt-linen.jpg', q: 'female fashion model wearing natural linen shirt studio high resolution' },
  { file: 'women-shirt-striped.jpg', q: 'female fashion model wearing vertical striped shirt high resolution' },
  { file: 'women-shirt-oxford.jpg', q: 'female fashion model wearing oxford button down shirt high resolution' },
  { file: 'women-shirt-classic.jpg', q: 'female fashion model wearing classic white dress shirt high resolution' },
  { file: 'women-shirt-cuban-collar.jpg', q: 'female fashion model wearing cuban collar camp shirt high resolution' }
];

function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    const req = protocol.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return downloadImage(res.headers.location, filepath).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`HTTP ${res.statusCode}`));
      }
      // Ensure we're getting an image
      const contentType = res.headers['content-type'];
      if (!contentType || !contentType.startsWith('image/')) {
         return reject(new Error('Not an image'));
      }
      const fileStream = fs.createWriteStream(filepath);
      res.pipe(fileStream);
      fileStream.on('finish', () => {
        fileStream.close();
        resolve();
      });
    }).on('error', reject);
    req.on('timeout', () => { req.destroy(); reject(new Error('Timeout')); });
    req.setTimeout(10000);
  });
}

async function main() {
  for (const item of queries) {
    console.log(`Searching for: ${item.file} ("${item.q}")`);
    try {
      const results = await searchImages(item.q);
      
      let success = false;
      for (const res of results.results) {
        if (success) break;
        // only grab high-ish res images
        if (res.width < 1000 || res.height < 600) continue;
        
        console.log(`  Trying URL: ${res.image}`);
        try {
          await downloadImage(res.image, path.join(outputDir, item.file));
          console.log(`  ✓ Saved ${item.file} from ${res.image}`);
          success = true;
        } catch (e) {
          console.log(`  ✗ Failed: ${e.message}`);
        }
      }
    } catch (e) {
      console.error(e);
    }
  }
}

main().catch(console.error);
