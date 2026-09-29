const https = require('https');
const fs = require('fs');
const path = require('path');

const categories = [
  { slug: 'womens_waffle', prompt: '4K Ultra HD premium fashion photography of a young female model wearing a WAFFLE KNIT textured t-shirt, clearly showing the waffle fabric. Modern Gen-Z streetwear fashion. Photorealistic, ultra detailed, sharp, professional studio lighting.' },
  { slug: 'womens_drsleeves', prompt: '4K Ultra HD premium fashion photography of a young female model wearing an EXTENDED LONG SLEEVE t-shirt. Modern Gen-Z streetwear fashion. Photorealistic, ultra detailed, sharp, professional studio lighting.' },
  { slug: 'womens_raglan', prompt: '4K Ultra HD premium fashion photography of a young female model wearing a RAGLAN BASEBALL t-shirt with contrast sleeves. Modern Gen-Z streetwear fashion. Photorealistic, ultra detailed, sharp, professional studio lighting.' },
  { slug: 'womens_ringer', prompt: '4K Ultra HD premium fashion photography of a young female model wearing a RINGER t-shirt with contrast collar trim. Modern Gen-Z streetwear fashion. Photorealistic, ultra detailed, sharp, professional studio lighting.' },
  { slug: 'womens_crewneck', prompt: '4K Ultra HD premium fashion photography of a young female model wearing a classic CREW NECK t-shirt. Modern Gen-Z streetwear fashion. Photorealistic, ultra detailed, sharp, professional studio lighting.' },
  { slug: 'womens_oversized', prompt: '4K Ultra HD premium fashion photography of a young female model wearing a heavily OVERSIZED baggy streetwear t-shirt. Modern Gen-Z streetwear fashion. Photorealistic, ultra detailed, sharp, professional studio lighting.' },
  { slug: 'womens_crop', prompt: '4K Ultra HD premium fashion photography of a young female model wearing a CROP TOP t-shirt showing her midriff. Modern Gen-Z streetwear fashion. Photorealistic, ultra detailed, sharp, professional studio lighting.' },
  { slug: 'womens_polo', prompt: '4K Ultra HD premium fashion photography of a young female model wearing a POLO shirt with a collar. Modern Gen-Z streetwear fashion. Photorealistic, ultra detailed, sharp, professional studio lighting.' },
  { slug: 'womens_zipper', prompt: '4K Ultra HD premium fashion photography of a young female model wearing a HALF ZIP t-shirt top with zipper detailing. Modern Gen-Z streetwear fashion. Photorealistic, ultra detailed, sharp, professional studio lighting.' },
  { slug: 'womens_boxy', prompt: '4K Ultra HD premium fashion photography of a young female model wearing a BOXY FIT structured t-shirt. Modern Gen-Z streetwear fashion. Photorealistic, ultra detailed, sharp, professional studio lighting.' },
  { slug: 'womens_tanktop', prompt: '4K Ultra HD premium fashion photography of a young female model wearing a sleeveless TANK TOP. Modern Gen-Z streetwear fashion. Photorealistic, ultra detailed, sharp, professional studio lighting.' }
];

function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return downloadImage(res.headers.location, filepath).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`Failed with status: ${res.statusCode}`));
      }
      const fileStream = fs.createWriteStream(filepath);
      res.pipe(fileStream);
      fileStream.on('finish', () => {
        fileStream.close();
        resolve();
      });
      fileStream.on('error', (err) => {
        fs.unlink(filepath, () => reject(err));
      });
    }).on('error', reject);
  });
}

async function run() {
  const outputDir = path.join(__dirname, 'public', 'images', 'heroes');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  for (let i = 0; i < categories.length; i++) {
    const img = categories[i];
    // Add seed to bypass cache and ensure uniqueness
    const seed = Math.floor(Math.random() * 1000000);
    const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(img.prompt)}?width=3840&height=2160&nologo=true&seed=${seed}`;
    const filepath = path.join(outputDir, `${img.slug}.jpg`);
    console.log(`[${i+1}/${categories.length}] Generating ${img.slug}...`);
    try {
      await downloadImage(url, filepath);
      console.log(`Success: ${img.slug}`);
    } catch (e) {
      console.error(`Failed ${img.slug}:`, e.message);
    }
  }
}

run().catch(console.error);
