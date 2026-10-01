const https = require('https');
const fs = require('fs');
const path = require('path');

const outputDir = path.join(__dirname, 'public', 'images', 'heroes');

const imageMap = {
  'men-shirt-cuban-collar.jpg': 'https://images.unsplash.com/photo-1620012253295-c159ce227653?w=1920&q=80', // wait, let's try a different one
  'women-shirt-oxford.jpg': 'https://images.unsplash.com/photo-1594225381867-b5bb1b2e6750?w=1920&q=80' // different image
};

// Trying new IDs for the failed ones
const newImageMap = {
  'men-shirt-cuban-collar.jpg': 'https://images.unsplash.com/photo-1599385611003-8889988ffbc6?w=1920&q=80',
  'women-shirt-oxford.jpg': 'https://images.unsplash.com/photo-1588117305388-c2631a279f82?w=1920&q=80'
};

function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    const request = https.get(url, (response) => {
      if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
        return downloadImage(response.headers.location, filepath).then(resolve).catch(reject);
      }
      if (response.statusCode !== 200) {
        reject(new Error(`HTTP ${response.statusCode}`));
        return;
      }
      const fileStream = fs.createWriteStream(filepath);
      response.pipe(fileStream);
      fileStream.on('finish', () => {
        fileStream.close();
        resolve();
      });
      fileStream.on('error', reject);
    }).on('error', reject);
  });
}

async function main() {
  for (const [filename, url] of Object.entries(newImageMap)) {
    const filepath = path.join(outputDir, filename);
    console.log(`Downloading ${filename}...`);
    try {
      await downloadImage(url, filepath);
      console.log(`✓ Saved ${filename}`);
    } catch (e) {
      console.error(`✗ Failed to download ${filename}: ${e.message}`);
    }
  }
}

main().catch(console.error);
