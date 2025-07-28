const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const PICTURES_DIR = './pictures';
const OPTIMIZED_DIR = './pictures/optimized';
const THUMBS_DIR = './pictures/thumbs';

// Create directories if they don't exist
if (!fs.existsSync(OPTIMIZED_DIR)) {
    fs.mkdirSync(OPTIMIZED_DIR, { recursive: true });
}
if (!fs.existsSync(THUMBS_DIR)) {
    fs.mkdirSync(THUMBS_DIR, { recursive: true });
}

async function optimizeImages() {
    const files = fs.readdirSync(PICTURES_DIR).filter(file => file.endsWith('.JPEG'));
    
    console.log(`Found ${files.length} images to optimize...`);
    
    for (const file of files) {
        const inputPath = path.join(PICTURES_DIR, file);
        const baseName = path.parse(file).name;
        
        try {
            // Generate optimized full-size WebP (reduce quality for size)
            const optimizedPath = path.join(OPTIMIZED_DIR, `${baseName}.webp`);
            await sharp(inputPath)
                .webp({ quality: 80 }) // Good quality with significant compression
                .resize(1200, 1200, { 
                    fit: 'inside', 
                    withoutEnlargement: true 
                })
                .toFile(optimizedPath);
            
            // Generate thumbnail WebP (400x400 for gallery grid)
            const thumbPath = path.join(THUMBS_DIR, `${baseName}.webp`);
            await sharp(inputPath)
                .webp({ quality: 75 })
                .resize(400, 400, { fit: 'cover' })
                .toFile(thumbPath);
            
            // Generate fallback JPEG versions (smaller than originals)
            const jpegPath = path.join(OPTIMIZED_DIR, `${baseName}.jpg`);
            await sharp(inputPath)
                .jpeg({ quality: 85 })
                .resize(1200, 1200, { 
                    fit: 'inside', 
                    withoutEnlargement: true 
                })
                .toFile(jpegPath);
            
            const thumbJpegPath = path.join(THUMBS_DIR, `${baseName}.jpg`);
            await sharp(inputPath)
                .jpeg({ quality: 80 })
                .resize(400, 400, { fit: 'cover' })
                .toFile(thumbJpegPath);
            
            console.log(`✓ Optimized ${file}`);
            
        } catch (error) {
            console.error(`✗ Failed to optimize ${file}:`, error.message);
        }
    }
    
    console.log('\n🎉 Image optimization complete!');
    
    // Show size comparison
    const originalSize = getDirectorySize(PICTURES_DIR);
    const optimizedSize = getDirectorySize(OPTIMIZED_DIR) + getDirectorySize(THUMBS_DIR);
    
    console.log(`Original size: ${(originalSize / 1024 / 1024).toFixed(1)}MB`);
    console.log(`Optimized size: ${(optimizedSize / 1024 / 1024).toFixed(1)}MB`);
    console.log(`Savings: ${(((originalSize - optimizedSize) / originalSize) * 100).toFixed(1)}%`);
}

function getDirectorySize(dir) {
    if (!fs.existsSync(dir)) return 0;
    
    let size = 0;
    const files = fs.readdirSync(dir);
    
    for (const file of files) {
        const filePath = path.join(dir, file);
        const stats = fs.statSync(filePath);
        
        if (stats.isFile()) {
            size += stats.size;
        }
    }
    
    return size;
}

// Run the optimization
optimizeImages().catch(console.error); 