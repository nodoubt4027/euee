const createGif = require('./generate-gif'); // Rename your main function to export
const fs = require('fs');
const path = require('path');

(async () => {
  const outDir = path.join(__dirname, 'gifs');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir);

  for (let tokenId = 1; tokenId <= 3500; tokenId++) {
    try {
      await createGif(tokenId, outDir);
    } catch (e) {
      console.error(`❌ Token #${tokenId} failed:`, e.message);
    }
  }
})();
