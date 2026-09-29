const fs = require('fs');

let code = fs.readFileSync('src/data/categories.js', 'utf8');

// The file contains `export const womensCategories = [...]` at the end
const startIndex = code.indexOf('export const womensCategories = [');
if (startIndex !== -1) {
  const beforeCode = code.slice(0, startIndex);
  const arrayCode = code.slice(startIndex);
  
  // arrayCode is a string representation of the array
  // We can easily parse it
  let justArray = arrayCode.replace('export const womensCategories = ', '').replace(/;\s*$/, '');
  let wCats;
  try {
    eval('wCats = ' + justArray);
    
    // Update the URLs
    wCats = wCats.map(c => {
      return {
        ...c,
        heroImage: `/images/heroes/womens_${c.slug}.jpg`,
        cardImage: `/images/heroes/womens_${c.slug}.jpg`
      };
    });
    
    const finalCode = beforeCode + 'export const womensCategories = ' + JSON.stringify(wCats, null, 2) + ';\n';
    fs.writeFileSync('src/data/categories.js', finalCode);
    console.log("SUCCESS");
  } catch (err) {
    console.error("Eval failed:", err);
  }
} else {
  console.log("Could not find womensCategories");
}
