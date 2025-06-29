const fs = require('fs');
const path = require('path');
const { createCanvas, loadImage } = require('canvas');
const GIFEncoder = require('gifencoder');
const fetch = require('node-fetch');

const frameWidth = 48;
const frameHeight = 64;
const outputWidth = 768;
const outputHeight = 1024;
const frameCount = 24;

const spritesPath = path.join(__dirname, 'sprites');

async function fetchMetadata(tokenId) {
    const url = `https://bafybeihcdehzbelc5wepxefh3gthbyguj4byrbpbz76osg5tb67xvk2frq.ipfs.w3s.link/${tokenId}`;
    const response = await fetch(url);
    return await response.json();
}

function getTraitFile(traits, traitType, folder) {
    const trait = traits.find(t => t.trait_type === traitType);
    return trait ? path.join(spritesPath, folder, `${trait.value}.png`) : null;
}

async function createGif(tokenId, outDir = __dirname) {
    console.log(`Generating Transparent GIF for Token ID: ${tokenId}...`);
    const metadata = await fetchMetadata(tokenId);
    const traits = metadata.attributes;
    const outputGif = path.join(outDir, `${tokenId}.gif`);

    const traitFiles = [
        getTraitFile(traits, "Auras", "Auras"),
        getTraitFile(traits, "Wings", "Wings"),
        getTraitFile(traits, "Armor", "Armor"),
        getTraitFile(traits, "Helm", "Helm"),
        getTraitFile(traits, "Weapon", "Weapon")
    ].filter(Boolean);

    console.log("Using sprites in order:", traitFiles);

    const encoder = new GIFEncoder(outputWidth, outputHeight);
    encoder.createReadStream().pipe(fs.createWriteStream(outputGif));
    encoder.start();
    encoder.setRepeat(0);
    encoder.setDelay(100);
    encoder.setQuality(10);
    encoder.setTransparent(0x00FF00);

    // Main canvas: final 768x1024
    const canvas = createCanvas(outputWidth, outputHeight);
    const ctx = canvas.getContext('2d', { alpha: true });
    ctx.imageSmoothingEnabled = false;

    // Temp canvas for compositing 48x64 frame
    const tempCanvas = createCanvas(frameWidth, frameHeight);
    const tempCtx = tempCanvas.getContext('2d', { alpha: true });
    tempCtx.imageSmoothingEnabled = false;

    // Load all trait images
    const traitImages = await Promise.all(traitFiles.map(loadImage));

    for (let i = 0; i < frameCount; i++) {
        // Clear both canvases
        ctx.clearRect(0, 0, outputWidth, outputHeight);
        tempCtx.clearRect(0, 0, frameWidth, frameHeight);

        // Composite one 48x64 frame on temp canvas
        for (const img of traitImages) {
            tempCtx.drawImage(
                img,
                i * frameWidth, 0,
                frameWidth, frameHeight,
                0, 0,
                frameWidth, frameHeight
            );
        }

        // Draw scaled-up temp canvas to main canvas
        ctx.drawImage(
            tempCanvas,
            0, 0,
            frameWidth, frameHeight,
            0, 0,
            outputWidth, outputHeight
        );

        encoder.addFrame(ctx);
    }

    encoder.finish();
    console.log(`✅ Transparent GIF saved: ${outputGif}`);
}

if (require.main === module) {
  const tokenId = process.argv[2] || 2349;
  createGif(tokenId);
} else {
  module.exports = createGif;
}
