const createGif = require('./generate-gif'); // Rename your main function to export
const fs = require('fs');
const path = require('path');

(async () => {
  const outDir = path.join(__dirname, 'gifs');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir);

  const tokenIds = [
    434, 1638 ];

  for (const tokenId of tokenIds) {
    try {
      await createGif(tokenId, outDir);
      console.log(`✅ Token #${tokenId} processed.`);
    } catch (e) {
      console.error(`❌ Token #${tokenId} failed:`, e.message);
    }
  }
})();
