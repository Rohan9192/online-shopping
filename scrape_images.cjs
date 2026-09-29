const puppeteer = require('puppeteer');
const fs = require('fs');
const https = require('https');
const path = require('path');

const categories = [
  { slug: 'womens_waffle', q: 'woman waffle shirt' },
  { slug: 'womens_drsleeves', q: 'woman long sleeve t-shirt' },
  { slug: 'womens_raglan', q: 'woman baseball t-shirt' },
  { slug: 'womens_ringer', q: 'woman ringer t-shirt' },
  { slug: 'womens_crewneck', q: 'woman crew neck t-shirt' },
  { slug: 'womens_oversized', q: 'woman oversized t-shirt' },
  { slug: 'womens_crop', q: 'woman crop top' },
  { slug: 'womens_polo', q: 'woman polo shirt' },
  { slug: 'womens_zipper', q: 'woman half zip shirt' },
  { slug: 'womens_boxy', q: 'woman boxy t-shirt' },
  { slug: 'womens_tanktop', q: 'woman tank top' }
];

function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    // Modify URL for higher resolution if possible (Pexels allows ?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2)
    // We will just fetch exactly what we find or append size
    let fetchUrl = url;
    if (url.includes('images.pexels.com')) {
      fetchUrl = url.split('?')[0] + '?auto=compress&cs=tinysrgb&w=1920';
    }
    
    https.get(fetchUrl, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
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

async function scrapeImages() {
  console.log("Launching browser...");
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });
  
  const outputDir = path.join(__dirname, 'public', 'images', 'heroes');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  for (const cat of categories) {
    try {
      console.log(`Searching Pexels for: ${cat.q}...`);
      await page.goto(`https://www.pexels.com/search/${encodeURIComponent(cat.q)}/`, { waitUntil: 'domcontentloaded' });
      
      // Wait for images to load
      await page.waitForSelector('img[src*="images.pexels.com/photos/"]', { timeout: 10000 });
      
      const imageUrls = await page.evaluate(() => {
        const imgs = Array.from(document.querySelectorAll('img[src*="images.pexels.com/photos/"]'));
        return imgs.map(img => img.src);
      });
      
      // Filter out tiny avatars or icons
      const validUrls = imageUrls.filter(url => !url.includes('h=100') && !url.includes('w=100'));
      
      if (validUrls.length > 0) {
        const imgUrl = validUrls[0];
        console.log(`Found image: ${imgUrl}`);
        const filepath = path.join(outputDir, `${cat.slug}.jpg`);
        await downloadImage(imgUrl, filepath);
        console.log(`Downloaded ${cat.slug}.jpg`);
      } else {
        console.log(`NO IMAGES FOUND FOR ${cat.slug}`);
      }
      
    } catch (err) {
      console.log(`Error on ${cat.slug}: ${err.message}`);
    }
  }

  await browser.close();
  console.log("Finished all downloads.");
}

scrapeImages().catch(console.error);
