const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// Directory containing images to optimize
const imagesDir = './img';
const outputDir = './static/img';

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
}

// Function to optimize images
const optimizeImage = async (file) => {
    const inputFilePath = path.join(imagesDir, file);
    const outputFilePath = path.join(outputDir, file);

    try {
        await sharp(inputFilePath)
            // Resize to a maximum width of 800px
            .toFormat('jpg', { quality: 80 }) // Convert to JPEG with quality 80
            .toFile(outputFilePath);

        console.log(`Optimized: ${file}`);
    } catch (err) {
        console.error(`Error optimizing ${file}:`, err);
    }
};

// Read images from the directory
fs.readdir(imagesDir, (err, files) => {
    if (err) {
        console.error('Error reading images directory:', err);
        return;
    }

    // Optimize each image
    files.forEach(file => {
        if (/\.(jpg|jpeg|png|gif)$/i.test(file)) { // Check for image file types
            optimizeImage(file);
        }
    });
});