const createGif = require('./generate-gif'); // Rename your main function to export
const fs = require('fs');
const path = require('path');

(async () => {
  const outDir = path.join(__dirname, 'gifs');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir);

  const tokenIds = [
    3049, 296, 301, 334, 434, 445, 1061, 1312, 1431, 1638,
    1718, 1756, 1995, 1997, 1998, 2174, 3039
  ];

  for (const tokenId of tokenIds) {
    try {
      await createGif(tokenId, outDir);
      console.log(`✅ Token #${tokenId} processed.`);
    } catch (e) {
      console.error(`❌ Token #${tokenId} failed:`, e.message);
    }
  }
})();
