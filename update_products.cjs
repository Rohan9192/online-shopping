const fs = require('fs');
let code = fs.readFileSync('src/data/products.js', 'utf8');

// Find the products array
const startIndex = code.indexOf('export const products = [');
if (startIndex === -1) throw new Error("Could not find start of products");

const beforeCode = code.slice(0, startIndex);
// Find the end of the array (we assume it's ];)
const endIndex = code.indexOf('];', startIndex);
if (endIndex === -1) throw new Error("Could not find end of products");

const arrayCode = code.slice(startIndex, endIndex + 2);
const afterCode = code.slice(endIndex + 2);

// Extract just the array
let justArrayCode = arrayCode.replace('export const products = ', '');

// We need to parse it. We can eval it.
let products;
eval('products = ' + justArrayCode);

let newProducts = [];
products.forEach(p => {
  p.gender = 'MEN';
  newProducts.push({ ...p });
  
  let w = JSON.parse(JSON.stringify(p));
  w.gender = 'WOMEN';
  w.id = 'w-' + w.id;
  w.name = w.name; // Keep same name for now, or prefix it. Actually same name is cleaner since we have a gender filter.
  // Add some distinct mock data
  w.images = [...w.images];
  newProducts.push(w);
});

// Since the products contains require() for images, we can't easily stringify it back to JS if it had functions or require.
// Wait! `products.js` has string URLs, e.g. '/images/products/waffle.jpg'. So JSON.stringify is perfect.
const finalArrayStr = JSON.stringify(newProducts, null, 2);

const finalCode = beforeCode + 'export const products = ' + finalArrayStr + ';\n' + afterCode;
fs.writeFileSync('src/data/products.js', finalCode);
console.log("SUCCESS");
