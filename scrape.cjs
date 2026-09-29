const fs = require('fs');

async function scrape() {
  const q = encodeURIComponent("women streetwear t-shirt");
  const res = await fetch(`https://unsplash.com/s/photos/${q}`);
  const html = await res.text();
  
  const matches = [...html.matchAll(/https:\/\/images\.unsplash\.com\/photo-[a-zA-Z0-9-]+[^"'\s]+/g)];
  
  const uniqueUrls = [...new Set(matches.map(m => m[0].split('?')[0]))];
  console.log("Found:", uniqueUrls.slice(0, 15));
}

scrape().catch(console.error);
