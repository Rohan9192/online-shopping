const https = require('https');
const fs = require('fs');
const path = require('path');

async function searchUnsplash(query) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'unsplash.com',
      path: `/napi/search/photos?query=${encodeURIComponent(query)}&per_page=5`,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/json, text/plain, */*',
        'Referer': 'https://unsplash.com/'
      }
    };
    const req = https.get(options, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode !== 200) {
          return reject(new Error(`HTTP ${res.statusCode}: ${data}`));
        }
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
        return downloadImage(response.headers.location, filepath).then(resolve).catch(reject);
      }
      if (response.statusCode !== 200) {
        return reject(new Error(`HTTP ${response.statusCode}`));
      }
      const fileStream = fs.createWriteStream(filepath);
      response.pipe(fileStream);
      fileStream.on('finish', () => {
        fileStream.close();
        resolve();
      });
    }).on('error', reject);
  });
}

const queries = [
  { file: 'women-shirt-linen.jpg', q: 'woman linen shirt fashion' },
  { file: 'women-shirt-striped.jpg', q: 'woman striped shirt fashion' },
  { file: 'women-shirt-oxford.jpg', q: 'woman oxford shirt fashion' },
  { file: 'women-shirt-classic.jpg', q: 'woman white shirt fashion' },
  { file: 'women-shirt-cuban-collar.jpg', q: 'woman camp collar shirt fashion' }
];

const outputDir = path.join(__dirname, 'public', 'images', 'heroes');

async function main() {
  for (const item of queries) {
    console.log(`Searching for: ${item.file}...`);
    try {
      const data = await searchUnsplash(item.q);
      const photo = data.results.find(p => p.width > 2000);
      if (photo) {
        const url = `${photo.urls.raw}&w=3840&q=80`;
        console.log(`  Downloading ${url}...`);
        await downloadImage(url, path.join(outputDir, item.file));
        console.log(`  ✓ Saved ${item.file}`);
      } else {
        console.log(`  ✗ No high-res photo found`);
      }
    } catch (e) {
      console.error(`  ✗ Error: ${e.message}`);
    }
    // slight delay
    await new Promise(r => setTimeout(r, 2000));
  }
}

main().catch(console.error);
