const { image_search } = require('duckduckgo-images-api');
const fs = require('fs');
const https = require('https');
const http = require('http');
const path = require('path');

const categories = [
  { slug: 'womens_waffle', q: 'woman wearing waffle knit t-shirt fashion streetwear site:pinterest.com' },
  { slug: 'womens_drsleeves', q: 'woman long sleeve t-shirt fashion streetwear site:pinterest.com' },
  { slug: 'womens_raglan', q: 'woman raglan t-shirt baseball tee fashion site:pinterest.com' },
  { slug: 'womens_ringer', q: 'woman ringer t-shirt vintage style site:pinterest.com' },
  { slug: 'womens_crewneck', q: 'woman plain crew neck t-shirt fashion site:pinterest.com' },
  { slug: 'womens_oversized', q: 'woman oversized baggy t-shirt streetwear site:pinterest.com' },
  { slug: 'womens_crop', q: 'woman crop top t-shirt fashion site:pinterest.com' },
  { slug: 'womens_polo', q: 'woman polo shirt fashion site:pinterest.com' },
  { slug: 'womens_zipper', q: 'woman half zip t-shirt fashion site:pinterest.com' },
  { slug: 'womens_boxy', q: 'woman boxy fit t-shirt streetwear site:pinterest.com' },
  { slug: 'womens_tanktop', q: 'woman tank top fashion site:pinterest.com' }
];

function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    client.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return downloadImage(res.headers.location, filepath).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`Status ${res.statusCode}`));
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

async function scrapeImages() {
  const outputDir = path.join(__dirname, 'public', 'images', 'heroes');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  for (const cat of categories) {
    try {
      console.log(`Searching DDG for: ${cat.q}...`);
      const results = await image_search({ query: cat.q, moderate: true });
      
      let downloaded = false;
      for (const res of results) {
        if (res.image && !res.image.includes('x100') && res.image.endsWith('.jpg')) {
          console.log(`Found image: ${res.image}`);
          const filepath = path.join(outputDir, `${cat.slug}.jpg`);
          try {
            await downloadImage(res.image, filepath);
            console.log(`Downloaded ${cat.slug}.jpg`);
            downloaded = true;
            break; // Stop after first successful download
          } catch (e) {
            console.log(`Failed to download ${res.image}: ${e.message}`);
          }
        }
      }
      if (!downloaded) {
        console.log(`NO IMAGES DOWNLOADED FOR ${cat.slug}`);
      }
    } catch (err) {
      console.log(`Error on ${cat.slug}: ${err.message}`);
    }
    // Wait a bit to avoid rate limits
    await new Promise(r => setTimeout(r, 2000));
  }
  console.log("Finished all downloads.");
}

scrapeImages().catch(console.error);
