const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

const outputDir = path.join(__dirname, 'public', 'images', 'heroes');

const images = [
  {
    filename: 'men-shirt-classic.jpg',
    prompt: 'Professional high-end 4K fashion photography of a male model wearing a classic mens dress shirt. Traditional clean white button-front shirt with a standard spread collar, clean lines, timeless silhouette. Smart polished look, modern Gen-Z aesthetic, premium editorial, studio lighting, photorealistic, natural skin, sharp detail, no text, no watermark'
  },
  {
    filename: 'men-shirt-cuban-collar.jpg',
    prompt: 'Professional high-end 4K fashion photography of a male model wearing a mens Cuban collar camp collar shirt. Open notched relaxed collar that lies flat, not buttoned up. Relaxed resort-style shirt, modern contemporary fit, Gen-Z aesthetic, premium editorial, studio lighting, photorealistic, natural skin, sharp detail, no text, no watermark'
  },
  {
    filename: 'women-shirt-linen.jpg',
    prompt: 'Professional high-end 4K fashion photography of a female model wearing a womens linen shirt. Natural linen fabric texture clearly visible, breathable woven linen material, light neutral tone, relaxed refined fit. Modern Gen-Z aesthetic, premium editorial, studio lighting, photorealistic, natural skin, sharp detail, no text, no watermark'
  },
  {
    filename: 'women-shirt-striped.jpg',
    prompt: 'Professional high-end 4K fashion photography of a female model wearing a womens striped shirt. Clear vertical stripe pattern in contrasting tones, button-front shirt with prominent stripe design. Modern Gen-Z aesthetic, premium editorial, studio lighting, photorealistic, natural skin, sharp detail, no text, no watermark'
  },
  {
    filename: 'women-shirt-oxford.jpg',
    prompt: 'Professional high-end 4K fashion photography of a female model wearing a womens Oxford shirt. Characteristic Oxford cloth fabric with basket-weave texture, button-down collar, light blue color, smart-casual style. Modern Gen-Z aesthetic, premium editorial, studio lighting, photorealistic, natural skin, sharp detail, no text, no watermark'
  },
  {
    filename: 'women-shirt-classic.jpg',
    prompt: 'Professional high-end 4K fashion photography of a female model wearing a classic womens shirt. Traditional clean shirt design, crisp white button-front shirt with spread collar, clean lines, timeless silhouette. Modern Gen-Z aesthetic, premium editorial, studio lighting, photorealistic, natural skin, sharp detail, no text, no watermark'
  },
  {
    filename: 'women-shirt-cuban-collar.jpg',
    prompt: 'Professional high-end 4K fashion photography of a female model wearing a womens Cuban collar camp collar shirt. Open notched relaxed collar clearly visible, relaxed resort-style, modern contemporary fit. Gen-Z aesthetic, premium editorial, studio lighting, photorealistic, natural skin, sharp detail, no text, no watermark'
  }
];

function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    
    const request = (currentUrl, redirectCount = 0) => {
      if (redirectCount > 5) {
        reject(new Error('Too many redirects'));
        return;
      }
      
      protocol.get(currentUrl, { timeout: 120000 }, (response) => {
        if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
          request(response.headers.location, redirectCount + 1);
          return;
        }
        
        if (response.statusCode !== 200) {
          reject(new Error(`HTTP ${response.statusCode}`));
          return;
        }
        
        const fileStream = fs.createWriteStream(filepath);
        response.pipe(fileStream);
        fileStream.on('finish', () => {
          fileStream.close();
          const stats = fs.statSync(filepath);
          console.log(`  ✓ Saved: ${path.basename(filepath)} (${(stats.size / 1024).toFixed(0)} KB)`);
          resolve();
        });
        fileStream.on('error', reject);
      }).on('error', reject).on('timeout', () => reject(new Error('Timeout')));
    };
    
    request(url);
  });
}

async function main() {
  console.log(`Generating ${images.length} shirt images via Pollinations.ai...\n`);
  
  for (const img of images) {
    const encodedPrompt = encodeURIComponent(img.prompt);
    const url = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1920&height=1080&nologo=true&seed=${Date.now()}`;
    const filepath = path.join(outputDir, img.filename);
    
    console.log(`Generating: ${img.filename}...`);
    
    try {
      await downloadImage(url, filepath);
    } catch (err) {
      console.error(`  ✗ Failed: ${img.filename} - ${err.message}`);
    }
  }
  
  console.log('\nDone! Verifying all shirt images...\n');
  
  const allFiles = [
    'men-shirt-linen.jpg',
    'men-shirt-striped.jpg',
    'men-shirt-oxford.jpg',
    'men-shirt-classic.jpg',
    'men-shirt-cuban-collar.jpg',
    'women-shirt-linen.jpg',
    'women-shirt-striped.jpg',
    'women-shirt-oxford.jpg',
    'women-shirt-classic.jpg',
    'women-shirt-cuban-collar.jpg',
  ];
  
  for (const f of allFiles) {
    const fp = path.join(outputDir, f);
    if (fs.existsSync(fp)) {
      const stats = fs.statSync(fp);
      console.log(`✓ ${f} — ${(stats.size / 1024).toFixed(0)} KB`);
    } else {
      console.log(`✗ ${f} — MISSING`);
    }
  }
}

main().catch(console.error);
