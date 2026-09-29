const fs = require('fs');
let code = fs.readFileSync('src/data/categories.js', 'utf8');

// Find the export const tshirtCategories = [...];
const startIndex = code.indexOf('export const tshirtCategories = [');
if (startIndex === -1) throw new Error("Could not find start");
const endIndex = code.indexOf('];', startIndex);
const arrayCode = code.slice(startIndex, endIndex + 2);
let justArrayCode = arrayCode.replace('export const tshirtCategories = ', '');
let cats;
eval('cats = ' + justArrayCode);

let wCats = cats.map(c => {
  let w = JSON.parse(JSON.stringify(c));
  w.id = 'w-' + w.id;
  // We keep the exact same slug! Or change it to `w-${c.slug}`?
  // Wait, if it's the exact same slug, when we navigate to `/category/boxy`, it uses the SAME categories.js file?
  // It's better to keep the same slug, but we can differentiate by `collection` context globally!
  w.slug = w.slug; // keep the same
  w.name = w.name;
  w.heroImage = w.heroImage; // reusing same image for now
  w.cardImage = w.cardImage;
  return w;
});

const finalArrayStr = 'export const womensCategories = ' + JSON.stringify(wCats, null, 2) + ';\n';
// insert at end of file
fs.appendFileSync('src/data/categories.js', '\n' + finalArrayStr);
console.log("SUCCESS CATEGORIES");
