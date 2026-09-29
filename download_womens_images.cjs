const fs = require('fs');
const https = require('https');
const path = require('path');

const categories = [
  { slug: 'womens_waffle', q: 'woman wearing waffle knit t-shirt fashion' },
  { slug: 'womens_drsleeves', q: 'woman long sleeve t-shirt streetwear fashion' },
  { slug: 'womens_raglan', q: 'woman raglan t-shirt baseball tee fashion' },
  { slug: 'womens_ringer', q: 'woman ringer t-shirt vintage style fashion' },
  { slug: 'womens_crewneck', q: 'woman plain crew neck t-shirt fashion' },
  { slug: 'womens_oversized', q: 'woman oversized baggy t-shirt streetwear' },
  { slug: 'womens_crop', q: 'woman crop top t-shirt fashion' },
  { slug: 'womens_polo', q: 'woman polo shirt fashion' },
  { slug: 'womens_zipper', q: 'woman half zip t-shirt fashion' },
  { slug: 'womens_boxy', q: 'woman boxy fit t-shirt streetwear' },
  { slug: 'womens_tanktop', q: 'woman tank top fashion' }
];

async function scrapeUrl(query) {
  const url = `https://unsplash.com/s/photos/${encodeURIComponent(query)}`;
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    }
  });
  const html = await res.text();
  
  // Find the first premium or regular image matching the Unsplash format
  const matches = [...html.matchAll(/https:\/\/images\.unsplash\.com\/photo-[a-zA-Z0-9-]+[^"'\s]+/g)];
  if (matches.length > 0) {
    // Return first valid photo ID url (remove query params)
    return matches[0][0].split('?')[0];
  }
  return null;
}

function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    // Append high-res query params
    const fullUrl = `${url}?w=1920&q=80&fit=crop`;
    https.get(fullUrl, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        return downloadImage(res.headers.location, filepath).then(resolve).catch(reject);
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

async function main() {
  const outputDir = path.join(__dirname, 'public', 'images', 'heroes');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  for (const cat of categories) {
    console.log(`Searching for: ${cat.q}...`);
    try {
      let imgUrl = await scrapeUrl(cat.q);
      
      // Fallbacks if search fails
      if (!imgUrl) {
         console.log(`No results for ${cat.q}, using fallback search...`);
         imgUrl = await scrapeUrl('woman wearing t-shirt streetwear fashion');
      }
      
      if (imgUrl) {
        console.log(`Found image: ${imgUrl}. Downloading...`);
        const filepath = path.join(outputDir, `${cat.slug}.jpg`);
        await downloadImage(imgUrl, filepath);
        console.log(`Saved ${cat.slug}.jpg`);
      } else {
        console.error(`FAILED to find image for ${cat.slug}`);
      }
    } catch (err) {
      console.error(`Error processing ${cat.slug}:`, err.message);
    }
  }
  
  console.log("All downloads completed.");
}

main().catch(console.error);
