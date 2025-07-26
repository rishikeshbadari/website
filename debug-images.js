// Debug script to test GitHub image URLs
// Run this in Node.js to test your setup

const GITHUB_USERNAME = "rishikeshbadari"; // Replace with your username
const GITHUB_REPO = "website-images"; // Replace with your repo name
const GITHUB_PAT = "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"; // Replace with your token (or remove if repo is public)

const GITHUB_RAW_URL = "https://raw.githubusercontent.com";

// Test images from your gallery data
const testImages = [
    "75.JPEG",
    "74.JPEG", 
    "headshot.JPG"
];

async function testImageUrl(imageName) {
    let githubUrl;
    if (imageName === 'headshot.JPG') {
        githubUrl = `${GITHUB_RAW_URL}/${GITHUB_USERNAME}/${GITHUB_REPO}/main/${imageName}`;
    } else {
        githubUrl = `${GITHUB_RAW_URL}/${GITHUB_USERNAME}/${GITHUB_REPO}/main/pictures/${imageName}`;
    }
    
    console.log(`Testing: ${githubUrl}`);
    
    try {
        const headers = {};
        if (GITHUB_PAT && GITHUB_PAT !== "YOUR_GITHUB_TOKEN") {
            headers['Authorization'] = `Bearer ${GITHUB_PAT}`;
        }
        
        const response = await fetch(githubUrl, { headers });
        
        if (response.ok) {
            console.log(`✅ ${imageName}: Success (${response.status})`);
            console.log(`   Content-Type: ${response.headers.get('content-type')}`);
            console.log(`   Content-Length: ${response.headers.get('content-length')} bytes`);
        } else {
            console.log(`❌ ${imageName}: Failed (${response.status})`);
            console.log(`   Error: ${response.statusText}`);
        }
    } catch (error) {
        console.log(`❌ ${imageName}: Network error`);
        console.log(`   Error: ${error.message}`);
    }
    console.log('');
}

async function main() {
    console.log('=== GitHub Image URL Debug Test ===\n');
    
    if (GITHUB_USERNAME === "YOUR_GITHUB_USERNAME") {
        console.log("❌ Please update the GITHUB_USERNAME in this script");
        return;
    }
    
    if (GITHUB_REPO === "YOUR_REPO_NAME") {
        console.log("❌ Please update the GITHUB_REPO in this script");
        return;
    }
    
    console.log(`Testing repository: ${GITHUB_USERNAME}/${GITHUB_REPO}\n`);
    
    for (const image of testImages) {
        await testImageUrl(image);
    }
    
    console.log('=== Test Complete ===');
    console.log('\nIf all tests pass, your GitHub setup is correct.');
    console.log('If tests fail, check:');
    console.log('1. Repository exists and is accessible');
    console.log('2. Images exist in the expected folders');
    console.log('3. Repository is public OR you have a valid PAT');
    console.log('4. Folder structure matches: pictures/ for numbered images, root for headshot.JPG');
}

// Run if this file is executed directly
if (typeof window === 'undefined') {
    main().catch(console.error);
} 