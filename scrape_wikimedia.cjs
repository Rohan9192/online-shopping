const https = require('https');
const fs = require('fs');
const path = require('path');

async function searchWikimedia(query) {
  const url = `https://commons.wikimedia.org/w/api.php?action=query&format=json&generator=search&gsrnamespace=6&gsrsearch=${encodeURIComponent(query)}&gsrlimit=1&prop=imageinfo&iiprop=url`;
  
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Bot/1.0' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          const pages = json.query?.pages;
          if (pages) {
            const firstPage = Object.values(pages)[0];
            resolve(firstPage.imageinfo[0].url);
          } else {
            resolve(null);
          }
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Bot/1.0' } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return downloadImage(res.headers.location, filepath).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`HTTP ${res.statusCode}`));
      }
      const fileStream = fs.createWriteStream(filepath);
      res.pipe(fileStream);
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
  { file: 'women-shirt-cuban-collar.jpg', q: 'woman camp shirt fashion' }
];

const outputDir = path.join(__dirname, 'public', 'images', 'heroes');

async function main() {
  for (const item of queries) {
    console.log(`Searching for: ${item.file}...`);
    try {
      const url = await searchWikimedia(item.q);
      if (url) {
        console.log(`  Downloading ${url}...`);
        await downloadImage(url, path.join(outputDir, item.file));
        console.log(`  ✓ Saved ${item.file}`);
      } else {
        console.log(`  ✗ No image found`);
      }
    } catch (e) {
      console.error(`  ✗ Error: ${e.message}`);
    }
  }
}

main().catch(console.error);
