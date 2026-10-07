# Personal website

A static website with Home, Projects, and Pictures pages. The homepage
introduction and Pictures description are written in Markdown and compiled into
HTML before deployment.

## Editing content

- **Homepage introduction:** Edit `content/intro.md`. Use `#` for the greeting
  and a blank line between paragraphs. Markdown links, bold, and italics work
  too. Run `npm run build` to update your local preview. Vercel runs this build
  automatically during deployment. Do not edit the generated introduction in
  `index.html`.
- **Homepage photo:** `js/home-photo.js` randomly chooses one photo from
  `data/gallery-data.js` on each page load. It loads the full-quality original
  and displays it below the introduction without cropping or a slideshow.
- **Project list:** Edit the links and summaries in `projects.html`.
- **Project details:** Each project has its own HTML file in `projects/`,
  starting with `projects/qbreader.html`. To add a project, create another
  page there and link to it from `projects.html`. On project pages, shared
  styles and navigation use `../` to reach the site root.
- **Photography introduction:** Edit `content/pictures.md` (currently “I take
  pictures with”). Run `npm run build` and refresh to preview your changes.
  Vercel builds it automatically during deployment, just like the homepage
  introduction. Use blank lines for paragraphs; links, bold, and italics work too.
- **Photo list:** Edit `data/gallery-data.js`. Images are in `pictures/thumbs`
  and `pictures/full`.
- **Appearance:** Edit `css/site.css`.

The older `data/projects-data.js` and other legacy styles/scripts are no longer
loaded by these pages.

## Local Development

Use Node.js 20 or newer. Install the build dependency once, then build and serve:

```bash
npm install
npm run build
python3 -m http.server 8000
```

Then open `http://localhost:8000`.
