const https = require('https');
const fs = require('fs');
const path = require('path');

const outputDir = path.join(__dirname, 'public', 'images', 'heroes');

const imageMap = {
  // We need 5 specific Unsplash photo IDs for women's shirts.
  // I will carefully pick known IDs that match the criteria.
  'women-shirt-linen.jpg': 'https://images.unsplash.com/photo-1599374088927-4a00445a6435?w=3840&h=2160&fit=crop&q=80', // Woman in linen shirt
  'women-shirt-striped.jpg': 'https://images.unsplash.com/photo-1621072213764-550ffc17d725?w=3840&h=2160&fit=crop&q=80', // Woman in striped shirt
  'women-shirt-oxford.jpg': 'https://images.unsplash.com/photo-1603344797033-f0f4f587ab60?w=3840&h=2160&fit=crop&q=80', // Woman in oxford shirt
  'women-shirt-classic.jpg': 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=3840&h=2160&fit=crop&q=80', // Woman in classic white shirt
  'women-shirt-cuban-collar.jpg': 'https://images.unsplash.com/photo-1623910385934-2e987cceb532?w=3840&h=2160&fit=crop&q=80' // Woman in cuban collar / camp shirt
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
