// worker.js
const GITHUB_RAW_URL = "https://raw.githubusercontent.com/rishikeshbadari/website-images/main";

export default {
  async fetch(request, env) {
    return handleImageRequest(request, env);
  }
};

async function handleImageRequest(request, env) {
  const url = new URL(request.url);
  
  // Extract image name from URL path
  const pathSegments = url.pathname.split('/');
  const imageName = pathSegments[pathSegments.length - 1];
  
  // Validate image name (security)
  if (!imageName || imageName.includes('..') || !imageName.match(/\.(jpg|jpeg|png|webp)$/i)) {
    return new Response('Invalid image name', { status: 400 });
  }

  // Build GitHub URL - handle both pictures folder and root files
  let imageUrl;
  if (imageName === 'headshot.JPG') {
    // Headshot is in the root directory
    imageUrl = `${GITHUB_RAW_URL}/${imageName}`;
  } else {
    // Other images are in the pictures folder
    imageUrl = `${GITHUB_RAW_URL}/pictures/${imageName}`;
  }

  try {
    // Fetch from GitHub with authentication
    const githubResponse = await fetch(imageUrl, {
      headers: { 
        Authorization: `Bearer ${env.GITHUB_PAT}`,
        'User-Agent': 'Cloudflare-Worker-Image-Proxy'
      }
    });

    if (!githubResponse.ok) {
      console.error(`Failed to fetch ${imageUrl}: ${githubResponse.status}`);
      return new Response('Image not found', { status: 404 });
    }

    // Determine content type
    const contentType = getContentType(imageName);
    
    return new Response(githubResponse.body, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET",
        "X-Debug-URL": imageUrl
      }
    });
  } catch (error) {
    console.error('Error fetching image:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}

function getContentType(filename) {
  const ext = filename.split('.').pop().toLowerCase();
  switch (ext) {
    case 'jpg':
    case 'jpeg':
      return 'image/jpeg';
    case 'png':
      return 'image/png';
    case 'webp':
      return 'image/webp';
    case 'gif':
      return 'image/gif';
    default:
      return 'image/jpeg';
  }
} 