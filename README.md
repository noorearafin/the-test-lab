# The Test Lab

**A free, open-source website for practising UI test automation.**

**Live site:** https://thetestlab.trendportbd.com/

The Test Lab gives you a realistic, modern web UI to write automated tests against, without needing access to a production app. It covers the components and situations testers meet every day: forms, dropdowns, alerts, windows, iframes, tables, drag and drop, waits, shadow DOM, file uploads and a complete login flow.

It works with any browser automation tool, including **Selenium**, **Playwright**, **Cypress**, **WebdriverIO**, **Puppeteer**, **Robot Framework** and **TestCafe**.

- Plain HTML, CSS and JavaScript with zero runtime dependencies
- Deploy it as a website, or clone it and run it fully offline
- Fonts are bundled, so there are no CDN calls at all
- Every interactive element has a stable `id` **and** `data-testid`
- Visible locator hints on every card (click one to copy it)
- An on-page event log so you have something to assert against
- Light and dark themes, responsive down to mobile

---

## Quick start

You need either **Node.js 18+** or **Python 3**.

```bash
git clone https://github.com/noorearafin/the-test-lab.git
cd the-test-lab

# Option A: Node
npm install
npm start

# Option B: Python (no install needed)
python3 -m http.server 3000
```

Open **http://localhost:3000** in your browser.

> Serve the site over `http://` rather than opening the files directly. Popups, cookies, downloads and link status checks behave more reliably from a web server than from `file://` URLs.

---

## Practice pages

| Group | Page | What you can practise |
|---|---|---|
| Basics | [Form inputs](pages/forms.html) | Every input type, validation messages, read-only, disabled, hidden and prefilled fields, contenteditable |
| Basics | [Dropdowns](pages/dropdowns.html) | Native select, option groups, dependent dropdowns, multi-select, custom listbox, searchable combobox, datalist |
| Basics | [Checkboxes & radios](pages/checkboxes.html) | Select all with indeterminate state, radio groups, disabled options, toggle switches, ARIA checkbox |
| Basics | [Buttons & mouse](pages/buttons.html) | Click, double-click, right-click with context menu, dynamic ids, disabled buttons, mouse offsets, a moving target |
| Browser | [Alerts & modals](pages/alerts.html) | `alert`, `confirm`, `prompt`, delayed and chained dialogs, HTML modals |
| Browser | [Windows & tabs](pages/windows.html) | New tabs via link and JavaScript, multiple tabs, sized popups, messages between windows |
| Browser | [Iframes](pages/frames.html) | Single, nested and anonymous iframes |
| Browser | [Links & images](pages/links.html) | Working, broken, external and redirect links; broken image detection |
| Browser | [Cookies & storage](pages/storage.html) | Cookies, localStorage, sessionStorage and a consent banner |
| Data | [Web tables](pages/tables.html) | Static table, plus a dynamic table with sort, search, filter, pagination, row selection, add/edit/delete |
| Data | [Upload & download](pages/files.html) | Single and multiple uploads, file validation, hidden inputs, drop zone, downloads |
| Interactions | [Drag & drop](pages/drag-drop.html) | HTML5 drag and drop, moving items between lists, sortable list, custom slider |
| Interactions | [Hover & tooltips](pages/hover.html) | Hover menus, CSS and native tooltips, delayed tooltips, hover-reveal cards |
| Interactions | [Keyboard](pages/keyboard.html) | Key capture, shortcuts and chords, Tab order, Enter to submit, clipboard |
| Interactions | [Scrolling](pages/scrolling.html) | Infinite scroll, scroll containers, horizontal carousel, page scroll |
| Interactions | [SVG & canvas](pages/svg-canvas.html) | Clickable SVG shapes, an SVG chart with tooltips, a drawing canvas |
| Advanced | [Waits & dynamic content](pages/waits.html) | Elements that appear, disappear, enable or change later; spinners, progress bars, stale elements, overlays |
| Advanced | [UI widgets](pages/widgets.html) | Tabs, accordion, autocomplete, star rating, stepper, custom date picker, toasts |
| Advanced | [Shadow DOM](pages/shadow-dom.html) | Open, nested and closed shadow roots |
| Advanced | [Login flow](pages/login.html) | Validation, several account types, lockout after failures, redirect to a protected page, logout |

### Test accounts

| Username | Password | Result |
|---|---|---|
| `testuser` | `Test@123` | Logs in and redirects to `pages/secure.html` |
| `admin` | `Admin@123` | Logs in with the Administrator role |
| `locked` | `Test@123` | Shows "account locked" |
| `slowuser` | `Test@123` | Logs in after a 4 second delay |

Three failed attempts in a row lock the form for 30 seconds.

---

## Locator conventions

Every interactive element can be found in several ways, so you can practise whichever strategy you like:

| Strategy | Example |
|---|---|
| ID | `#firstName` |
| Test id | `[data-testid="first-name"]` or `getByTestId('first-name')` |
| Name | `[name="firstName"]` |
| Label | `getByLabel('First name')` |
| Role | `getByRole('button', { name: 'Create account' })` |

A few elements are intentionally harder, such as the button with a random `dyn-*` id on each page load, elements inside shadow roots, and SVG shapes that need `//*[name()='circle']` in XPath.

---

## Example test suites

Ready-to-run examples are in [`examples/`](examples). Start the site first with `npm start`.

**Playwright (JavaScript)**
```bash
cd examples/playwright
npm install
npx playwright install chromium
npx playwright test
```

**Selenium (Python)**
```bash
cd examples/selenium-python
pip install -r requirements.txt
pytest -v
```

**Selenium (Java)**: `examples/selenium-java/LoginTest.java` uses Selenium 4 and JUnit 5. Add it to your Maven or Gradle project.

**Cypress**
```bash
cd examples/cypress
npm install cypress --save-dev
npx cypress run --config-file cypress.config.js
```

All examples read the base URL from `http://localhost:3000`. Set `BASE_URL` to point them somewhere else, for example your GitHub Pages URL.

---

## Deploy it

The site is static, so any host works. Nothing needs to be built first.

### GitHub Pages (recommended)

A deploy workflow is already included at `.github/workflows/deploy.yml`.

1. Push the repository to GitHub.
2. Go to **Settings > Pages** and set **Source** to **GitHub Actions**.
3. Push to `main`, or run the *Deploy to GitHub Pages* workflow by hand.

Your site goes live at `https://noorearafin.github.io/the-test-lab/`. Every link is relative, so it works just as well from a sub-folder as from a domain root.

If you would rather not use Actions, set **Source** to **Deploy from a branch**, then pick `main` and `/ (root)`. The `.nojekyll` file is already there so folders starting with an underscore are served correctly.

### Any other host

Netlify, Vercel, Cloudflare Pages, S3, Nginx or Apache: point them at the repository root, with no build command and no publish directory. On Netlify and Vercel you can also drag the folder straight into their dashboard.

### After deploying

The repository URL and the author links live at the top of `assets/js/layout.js`, in `CUSTOM_REPO_URL` and `AUTHOR`. Change them there if you fork the project or move it to another account.

---

## Use it offline

Everything needed to run the site is committed to the repository. Fonts are bundled in `assets/fonts/`, there are no CDN requests, and nothing is fetched from the internet at runtime.

**From a clone:**

```bash
git clone https://github.com/noorearafin/the-test-lab.git
cd the-test-lab
npm start                 # or: python3 -m http.server 3000
```

**From the deployed site:** a service worker (`sw.js`) caches the whole site on the first visit, so it keeps working after you lose your connection, and it can be installed as an app from the browser menu. Pages are always fetched from the network first when one is available, so you never test a stale page.

To turn caching off, delete `sw.js` and the service worker block near the bottom of `assets/js/layout.js`.

**Opening the files directly** with `file://` also works for most pages, but serve over `http://` when you can: popups, cookies, downloads and the link status checker need a real web server.

Two links on the *Links & images* page point at `httpbin.org` on purpose, to give you real 404, 500 and redirect responses. They are the only things on the site that need an internet connection, and everything else still works without them.

---

## Project structure

```
the-test-lab/
├── index.html                 Landing page
├── pages/                     One HTML file per practice page, plus helper pages
├── sw.js                      Service worker for offline use
├── manifest.webmanifest       Lets the site be installed as an app
├── assets/
│   ├── css/styles.css         Design system (light and dark themes)
│   ├── js/layout.js           Shared header, sidebar, event log and helpers
│   ├── js/pages/              One script per page
│   ├── fonts/                 Self-hosted fonts (OFL licensed)
│   ├── img/                   Favicon and images
│   └── files/                 Sample files for upload and download tests
├── examples/                  Playwright, Selenium (Python and Java) and Cypress examples
└── .github/workflows/         Pages deployment and Playwright CI
```

If you add a page, also add it to the file list in `sw.js` so it is cached for offline use. To add a page, create `pages/<slug>.html` and `assets/js/pages/<slug>.js` using an existing page as a template, then add an entry to the `PAGES` list in `assets/js/layout.js`. It will appear in the sidebar, on the home page and in the previous/next links automatically.

---

## Contributing

Contributions are welcome. Open an issue to suggest a new component or report a bug, or send a pull request. Please keep the project dependency-free and give every new interactive element an `id` and a `data-testid`.

## Author

**Noor E Arafin**
[GitHub](https://github.com/noorearafin) · [LinkedIn](https://www.linkedin.com/in/noorearafin)

## License

Code is [MIT](LICENSE) licensed. The bundled fonts, Plus Jakarta Sans and JetBrains Mono, are under the SIL Open Font License; their licences are in `assets/fonts/`.
