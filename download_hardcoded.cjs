const https = require('https');
const fs = require('fs');
const path = require('path');

const images = [
  { slug: 'womens_waffle', id: '1529139574466-a303027c1d8b' },
  { slug: 'womens_drsleeves', id: '1515886657613-9f3515b0c78f' },
  { slug: 'womens_raglan', id: '1503342217505-b0a15ec3261c' },
  { slug: 'womens_ringer', id: '1534528741775-53994a69daeb' },
  { slug: 'womens_crewneck', id: '1512436991641-6745cdb1723f' },
  { slug: 'womens_oversized', id: '1516762659827-248698064d5c' },
  { slug: 'womens_crop', id: '1524504388940-b1c1722653e1' },
  { slug: 'womens_polo', id: '1525507119028-ed4c629a60a3' },
  { slug: 'womens_zipper', id: '1503341455253-b2e723bb3dbb' },
  { slug: 'womens_boxy', id: '1521572163474-6864f9cf17ab' },
  { slug: 'womens_tanktop', id: '1503342394128-c104d54dba01' }
];

function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
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

  for (const img of images) {
    const url = `https://images.unsplash.com/photo-${img.id}?w=1920&q=80&fit=crop`;
    const filepath = path.join(outputDir, `${img.slug}.jpg`);
    console.log(`Downloading ${img.slug}...`);
    try {
      await downloadImage(url, filepath);
      console.log(`Success: ${img.slug}`);
    } catch (e) {
      console.error(`Failed ${img.slug}:`, e.message);
    }
  }
}

run().catch(console.error);
