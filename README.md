# Personal website

A static website with Home, Projects, Essays, and Pictures pages. The homepage
introduction and Pictures description are written in Markdown and compiled into
HTML before deployment.

## Editing content

- **Homepage introduction:** Edit `content/intro.md`. Use `#` for the greeting
  and a blank line between paragraphs. Markdown links, bold, and italics work
  too. Run `npm run build` to update your local preview. Vercel runs this build
  automatically during deployment. Do not edit the generated introduction in
  `index.html`.
- **Homepage photo:** `js/home-photo.js` randomly chooses one photo from
  `data/gallery-data.js` on each page load. It first displays a small preview,
  then replaces it with the full-quality original in the background, without
  cropping or a slideshow. The homepage reveals its content once the preview
  has loaded and decoded, rather than waiting for the large original.
  A failed request or a 15-second timeout reveals the page anyway. This does
  not affect asynchronous image loading on Pictures.
- **Project list:** Edit the links and summaries in `projects.html`.
- **Essays introduction:** Edit `content/essays.md` to add text above the essay
  links on the Essays page. Paragraphs, headings, links, and other Markdown
  formatting work. Run `npm run build` and refresh to preview changes.
- **New essay:** Run `npm run essay -- "Your essay title"` (or `npm run essay`
  to be asked for a title). This creates the Markdown file in `essays/`, adds
  it at the top of the list, and builds the essay pages. Open the printed file
  path and write beneath its title.
- **Essay order:** Open `essays/order.txt` and move filenames up or down.
  One filename per line; no numbers or JSON needed. The top line appears first.
  Blank lines and comments starting with `#` are ignored. Unlisted Markdown
  files still appear afterward, alphabetically. Entries for deleted files are ignored.
- **Editing essays:** Edit `essays/*.md`, then run `npm run build` and refresh.
  A `# Title` heading sets the displayed title. Without one, the title comes
  from the filename (`a-new-idea.md` → “A New Idea”). Headings are optional,
  and your text is rendered as written. The filename sets the URL
  (`music.md` → `/essays/music.html`). You can also add Markdown files
  directly; use lowercase filenames with hyphens.
  Removing a Markdown file removes its generated page on the next build.
  Vercel runs the same build automatically.
- **Project details:** Each project has its own HTML file in `projects/`,
  starting with `projects/qbreader.html`. To add a project, create another
  page there and link to it from `projects.html`. On project pages, shared
  styles and navigation use `../` to reach the site root.
- **Photography introduction:** Edit `content/pictures.md` (currently “I take
  pictures with”). Run `npm run build` and refresh to preview your changes.
  Vercel builds it automatically during deployment, just like the homepage
  introduction. Use blank lines for paragraphs; links, bold, and italics work too.
- **Photo list:** Edit `data/gallery-data.js`. Images are in `pictures/thumbs`
  and `pictures/full`. After adding thumbnails, run `npm run build` to update
  `data/gallery-dimensions.js`. These dimensions keep the gallery layout stable
  while photos load asynchronously.
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
