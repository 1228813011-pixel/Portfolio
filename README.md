# ETC Portfolio Template (Static Site)

This is a clean, fast portfolio template for CMU ETC-style submissions: demo-first, consistent case-study pages, and easy hosting.

## Files
- `index.html` — landing page + project grid (auto rendered from JS array)
- `projects/*.html` — case study pages (copy/duplicate per project)
- `assets/style.css` — styling
- `assets/app.js` — theme toggle, filters, reveal animations, project data

## Quick start (local)
Just open `index.html` in a browser.

## Deploy (recommended)
### Option A: GitHub Pages
1. Create a repo (e.g., `portfolio`)
2. Upload all files
3. Settings → Pages → Deploy from branch (`main` / `/root`)
4. You get a URL like: `https://<user>.github.io/portfolio/`

### Option B: Netlify / Vercel
Drag-and-drop the folder, or connect repo. It’s a static site.

## Customize
1. Open `assets/app.js`
2. Edit the `PROJECTS` array (title/desc/tags/href)
3. Duplicate a project page in `projects/` and update the content


## Tips
- Put a **60–90s** demo video near the top of every project page.
- For team projects, include a clear **Your Role** section.
- Keep external links stable (YouTube/Vimeo/GitHub/itch).

Enjoy shipping your “project narrative”, not just the artifacts.
