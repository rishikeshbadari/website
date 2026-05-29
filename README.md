# Rishikesh Badari — Personal Website

Public source for my personal website and portfolio: [rishikeshbadari.com](https://www.rishikeshbadari.com).

The site is intentionally lightweight: static HTML, CSS, and vanilla JavaScript, deployed with Vercel. It includes a homepage, project cards with modal demos, blog scaffolding, optimized photography assets, and embedded project artifacts.

## Structure

```text
.
├── index.html              # Homepage
├── projects.html           # Standalone projects page
├── blog.html               # Standalone blog page
├── css/                    # Shared and page-specific styles
├── js/                     # Browser-side interaction scripts
├── data/                   # Gallery, project, and blog data
├── assets/                 # Logos and profile assets
├── pictures/               # Optimized photography and thumbnails
├── projects/               # Embedded demos, reports, and project media
├── vendor/                 # Vendored third-party browser libraries
└── vercel.json             # Vercel routing and cache headers
```

## Local Development

No build step is required.

```bash
python3 -m http.server 8000
```

Then open [http://localhost:8000](http://localhost:8000).

## Deployment

The repository is configured for Vercel:

- `/projects` rewrites to `projects.html`
- `/blog` rewrites to `blog.html`
- static media under `assets/`, `pictures/`, and `vendor/` receives long-lived cache headers
- CSS and JavaScript files use no-cache headers so updates propagate quickly

## Notes

- The site does not require runtime secrets or API keys.
- Photography assets are stored as optimized `.jpg` and `.webp` files, with thumbnails in `pictures/thumbs/`.
- Larger project artifacts, including reports and demos, live under `projects/`.
