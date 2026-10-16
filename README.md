# Kingdom Management Solutions, LLC

Static website (plain HTML/CSS/JS), ready for GitHub Pages.

## Publish
1. Create a GitHub repo and push these files to the `main` branch.
2. Repo **Settings → Pages → Build and deployment**: Source = "Deploy from a branch", Branch = `main`, folder `/ (root)`.
3. Your site will be live at `https://<user>.github.io/<repo>/`.
   Custom domain: add it under Pages settings and create a `CNAME` file.

## Editing the hero
The hero background rotates through `data-playlist` in `index.html` (entries are `file | project name | label | link`, files in `media/`). Each item lasts `SLIDE_MS` (7s) in `script.js`; videos start at their midpoint. `--video-zoom` in `styles.css` crops the dark side bars in the game clips; set it to 1 for full-frame videos.

## Before launch
Connect the contact form: create a free form at formspree.io (deliver to kingdommanagementsolutions@gmail.com) and paste its URL into `FORM_ENDPOINT` in `contact.js`. Until then the form shows "not connected yet". Do not commit the `_artifact` folder; it is only the single-file copy used for the Claude page. Preview locally with `npx http-server` (Python's simple server cannot seek video).
