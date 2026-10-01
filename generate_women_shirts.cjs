const https = require('https');
const fs = require('fs');
const path = require('path');

const outputDir = path.join(__dirname, 'public', 'images', 'heroes');
if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

const images = [
  {
    filename: 'women-shirt-linen.jpg',
    prompt: 'Professional high-end 4K fashion photography of a female model wearing a womens linen shirt. Natural linen fabric texture clearly visible, breathable woven linen material, relaxed fit. Female model, beautiful natural skin, studio lighting, photorealistic, no text, no watermark.'
  },
  {
    filename: 'women-shirt-striped.jpg',
    prompt: 'Professional high-end 4K fashion photography of a female model wearing a womens striped shirt. Clear vertical stripe pattern, prominent stripe design. Female model, beautiful natural skin, studio lighting, photorealistic, no text, no watermark.'
  },
  {
    filename: 'women-shirt-oxford.jpg',
    prompt: 'Professional high-end 4K fashion photography of a female model wearing a womens Oxford shirt. Characteristic Oxford cloth fabric with basket-weave texture, smart-casual style. Female model, beautiful natural skin, studio lighting, photorealistic, no text, no watermark.'
  },
  {
    filename: 'women-shirt-classic.jpg',
    prompt: 'Professional high-end 4K fashion photography of a female model wearing a classic womens shirt. Crisp white button-front shirt with standard collar, clean lines, timeless silhouette. Female model, beautiful natural skin, studio lighting, photorealistic, no text, no watermark.'
  },
  {
    filename: 'women-shirt-cuban-collar.jpg',
    prompt: 'Professional high-end 4K fashion photography of a female model wearing a womens Cuban collar camp collar shirt. Open notched relaxed collar clearly visible, relaxed resort-style fit. Female model, beautiful natural skin, studio lighting, photorealistic, no text, no watermark.'
  }
];

function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302 || response.statusCode === 307 || response.statusCode === 308) {
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
      fileStream.on('error', reject);
    }).on('error', reject);
  });
}

function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
  console.log(`Generating ${images.length} Women's shirt images via Pollinations.ai...\n`);
  
  for (const img of images) {
    const encodedPrompt = encodeURIComponent(img.prompt);
    // Added a random seed to bypass cache, and explicit width/height
    const seed = Math.floor(Math.random() * 1000000);
    const url = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=3840&height=2160&nologo=true&seed=${seed}`;
    const filepath = path.join(outputDir, img.filename);
    
    console.log(`Generating: ${img.filename}...`);
    
    let success = false;
    let attempts = 0;
    while (!success && attempts < 3) {
      attempts++;
      try {
        await downloadImage(url, filepath);
        const stats = fs.statSync(filepath);
        if (stats.size > 50000) { // must be larger than 50KB to be a real image
          console.log(`  ✓ Saved: ${img.filename} (${(stats.size / 1024).toFixed(0)} KB)`);
          success = true;
        } else {
          console.log(`  ✗ File too small on attempt ${attempts}`);
        }
      } catch (err) {
        console.error(`  ✗ Failed attempt ${attempts} for ${img.filename} - ${err.message}`);
      }
      if (!success) await wait(3000); // 3 sec delay before retry
    }
    await wait(3000); // 3 sec delay between images
  }
}

main().catch(console.error);
