#!/bin/bash

echo "🚀 Setting up image optimization for your website..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first:"
    echo "   Visit: https://nodejs.org/"
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ Node.js and npm found"

# Install dependencies
echo "📦 Installing image optimization dependencies..."
npm install

if [ $? -eq 0 ]; then
    echo "✅ Dependencies installed successfully"
else
    echo "❌ Failed to install dependencies"
    exit 1
fi

# Run image optimization
echo "🖼️  Starting image optimization..."
echo "This will create optimized WebP and JPEG versions of your images..."

npm run optimize

if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 Image optimization complete!"
    echo ""
    echo "📁 Your optimized images are now in:"
    echo "   • pictures/thumbs/ (400x400 thumbnails)"
    echo "   • pictures/optimized/ (1200x1200 max)"
    echo ""
    echo "🚀 Your website should now load images much faster!"
    echo ""
    echo "💡 Next steps:"
    echo "   1. Test your website to ensure images load properly"
    echo "   2. Consider setting up a CDN for even better performance"
    echo "   3. Monitor your website's loading speed with tools like:"
    echo "      • Google PageSpeed Insights"
    echo "      • GTmetrix"
    echo "      • WebPageTest"
else
    echo "❌ Image optimization failed"
    exit 1
fi 