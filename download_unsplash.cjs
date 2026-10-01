const https = require('https');
const fs = require('fs');
const path = require('path');

const outputDir = path.join(__dirname, 'public', 'images', 'heroes');
if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

// A small list of known Unsplash/Pexels public URLs that match the criteria
const imageMap = {
  'men-shirt-classic.jpg': 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=1920&q=80',
  'men-shirt-cuban-collar.jpg': 'https://images.unsplash.com/photo-1620012253295-c159ce227653?w=1920&q=80',
  'women-shirt-linen.jpg': 'https://images.unsplash.com/photo-1598554747436-c9293d6a588f?w=1920&q=80',
  'women-shirt-striped.jpg': 'https://images.unsplash.com/photo-1548624313-0396c75e4b1a?w=1920&q=80',
  'women-shirt-oxford.jpg': 'https://images.unsplash.com/photo-1582210817025-a131804cc636?w=1920&q=80',
  'women-shirt-classic.jpg': 'https://images.unsplash.com/photo-1550639525-c97d455acf70?w=1920&q=80',
  'women-shirt-cuban-collar.jpg': 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1920&q=80',
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
  for (const [filename, url] of Object.entries(imageMap)) {
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
