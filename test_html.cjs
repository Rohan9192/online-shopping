const fs = require('fs');

async function test() {
  const url = `https://unsplash.com/s/photos/woman-fashion`;
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    }
  });
  const html = await res.text();
  fs.writeFileSync('unsplash_test.html', html);
  console.log("Written HTML to unsplash_test.html. Length:", html.length);
  
  // Try to find ANY images
  const matches = [...html.matchAll(/images\.unsplash\.com\/photo-[a-zA-Z0-9-]+/g)];
  console.log("Matches:", matches.length > 0 ? matches[0][0] : "None");
}
test().catch(console.error);
