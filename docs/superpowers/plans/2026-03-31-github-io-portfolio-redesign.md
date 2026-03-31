# GitHub.io Portfolio Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a bilingual GitHub Pages portfolio for `kimbsu00.github.io` that preserves the source Oopy portfolio content while redesigning the presentation into a custom editorial-style site.

**Architecture:** Use a Vite-based static site with plain TypeScript, reusable rendering helpers, structured local content modules for Korean and English, route-aware page rendering for `/ko/`, `/en/`, and project detail pages, and a GitHub Actions deploy workflow for Pages. Korean remains the canonical deep-content version; English mirrors the main sections while explicitly labeling untranslated deep details as `Available in Korean only`.

**Tech Stack:** Vite, TypeScript, vanilla DOM rendering, CSS, Node built-in `node:test`, GitHub Pages via GitHub Actions

---

### Task 1: Bootstrap the Vite static site

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `tsconfig.node.json`
- Create: `vite.config.ts`
- Create: `index.html`
- Create: `src/main.ts`
- Create: `src/style.css`
- Create: `src/vite-env.d.ts`

- [ ] **Step 1: Create the Vite package manifest**

```json
{
  "name": "kimbsu00.github.io",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc --noEmit && vite build",
    "preview": "vite preview",
    "typecheck": "tsc --noEmit",
    "test": "node --test"
  },
  "devDependencies": {
    "typescript": "^5.8.0",
    "vite": "^7.0.0"
  }
}
```

- [ ] **Step 2: Add TypeScript and Vite config**

```ts
// vite.config.ts
import { defineConfig } from "vite";

export default defineConfig({
  server: {
    host: true
  }
});
```

```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2022",
    "useDefineForClassFields": true,
    "module": "ESNext",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "skipLibCheck": true,
    "moduleResolution": "Bundler",
    "allowImportingTsExtensions": false,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true
  },
  "include": ["src", "tests", "vite.config.ts"]
}
```

- [ ] **Step 3: Create the HTML entrypoint**

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Kim ByeongSu Portfolio</title>
    <meta
      name="description"
      content="Bilingual portfolio site for Android developer Kim ByeongSu."
    />
    <script type="module" src="/src/main.ts"></script>
  </head>
  <body>
    <div id="app"></div>
  </body>
</html>
```

- [ ] **Step 4: Create the minimal app mount**

```ts
// src/main.ts
import "./style.css";

const app = document.querySelector<HTMLDivElement>("#app");

if (!app) {
  throw new Error("App root not found");
}

app.innerHTML = "<p>Portfolio app bootstrapped.</p>";
```

- [ ] **Step 5: Install dependencies**

Run: `npm install`
Expected: install completes and creates `package-lock.json`

- [ ] **Step 6: Verify the scaffold builds**

Run: `npm run build`
Expected: Vite outputs a production build in `dist/`

- [ ] **Step 7: Commit**

```bash
git add package.json package-lock.json tsconfig.json tsconfig.node.json vite.config.ts index.html src/main.ts src/style.css src/vite-env.d.ts
git commit -m "Establish the static site foundation for the portfolio rebuild" -m "This bootstraps a Vite-based TypeScript site for the GitHub Pages portfolio so later tasks can focus on content modeling, rendering, and deployment without also solving toolchain setup." -m "Constraint: Keep the stack small and easy to maintain on GitHub Pages
Rejected: Jekyll | weaker fit for the planned custom bilingual UI
Confidence: high
Scope-risk: narrow
Directive: Do not add framework dependencies unless a later requirement makes the DOM approach clearly insufficient
Tested: npm install
Tested: npm run build
Not-tested: GitHub Pages deployment"
```

### Task 2: Add the bilingual content model and route helpers

**Files:**
- Create: `src/content/site.ts`
- Create: `src/content/projects.ts`
- Create: `src/lib/routes.ts`
- Create: `src/lib/content.ts`
- Create: `tests/routes.test.mjs`

- [ ] **Step 1: Write the failing route and content tests**

```js
// tests/routes.test.mjs
import test from "node:test";
import assert from "node:assert/strict";
import { normalizePath, parseRoute } from "../dist-test/routes.js";

test("normalizePath defaults root to korean homepage", () => {
  assert.equal(normalizePath("/"), "/ko/");
});

test("parseRoute resolves english project detail paths", () => {
  assert.deepEqual(parseRoute("/en/projects/mobit/"), {
    locale: "en",
    page: "project",
    slug: "mobit"
  });
});
```

- [ ] **Step 2: Implement the route helpers**

```ts
// src/lib/routes.ts
export type Locale = "ko" | "en";

export type Route =
  | { locale: Locale; page: "home" }
  | { locale: Locale; page: "project"; slug: string };

export function normalizePath(pathname: string): string {
  if (pathname === "/") return "/ko/";
  return pathname.endsWith("/") ? pathname : `${pathname}/`;
}

export function parseRoute(pathname: string): Route {
  const path = normalizePath(pathname);
  const parts = path.split("/").filter(Boolean);
  const locale = (parts[0] as Locale) ?? "ko";

  if (parts[1] === "projects" && parts[2]) {
    return { locale, page: "project", slug: parts[2] };
  }

  return { locale, page: "home" };
}
```

- [ ] **Step 3: Add bilingual structured content modules**

```ts
// src/content/site.ts
export const siteContent = {
  ko: {
    name: "김병수",
    englishName: "ByeongSu Kim",
    role: "안드로이드 앱 개발자",
    availabilityLabel: "한국어에서만 자세한 내용을 볼 수 있습니다."
  },
  en: {
    name: "Kim ByeongSu",
    englishName: "ByeongSu Kim",
    role: "Android Developer",
    availabilityLabel: "Available in Korean only"
  }
} as const;
```

```ts
// src/content/projects.ts
export const projects = [
  {
    slug: "mobit",
    featured: true,
    locales: {
      ko: { title: "Mobit", summary: "가상화폐 모의투자 앱" },
      en: { title: "Mobit", summary: "A cryptocurrency paper-trading app" }
    }
  }
] as const;
```

- [ ] **Step 4: Add a content lookup helper**

```ts
// src/lib/content.ts
import { projects } from "../content/projects";
import type { Locale } from "./routes";

export function getProject(slug: string, locale: Locale) {
  const project = projects.find((entry) => entry.slug === slug);
  if (!project) return null;

  return {
    ...project,
    copy: project.locales[locale]
  };
}
```

- [ ] **Step 5: Run tests and typecheck**

Run: `npm run typecheck`
Expected: PASS

Run: `npm test`
Expected: FAIL first because `dist-test/routes.js` does not exist

- [ ] **Step 6: Add a simple build-for-tests bridge and rerun**

```json
// package.json scripts addition
{
  "scripts": {
    "pretest": "tsc --outDir dist-test --module ESNext --target ES2022 src/lib/routes.ts",
    "test": "node --test"
  }
}
```

Run: `npm test`
Expected: PASS with the route helper tests green

- [ ] **Step 7: Commit**

```bash
git add package.json src/content/site.ts src/content/projects.ts src/lib/routes.ts src/lib/content.ts tests/routes.test.mjs
git commit -m "Lock the bilingual routing and content model before rendering" -m "This adds the structured content and path parsing that the bilingual portfolio depends on, with tests guarding default korean routing and english project detail resolution." -m "Constraint: Avoid adding external test dependencies
Confidence: high
Scope-risk: narrow
Directive: Keep korean and english content in shared structures so they cannot drift into separate architectures
Tested: npm run typecheck
Tested: npm test
Not-tested: Browser rendering"
```

### Task 3: Build the shared application shell and homepage sections

**Files:**
- Create: `src/app.ts`
- Create: `src/components/layout.ts`
- Create: `src/components/hero.ts`
- Create: `src/components/section.ts`
- Create: `src/components/project-card.ts`
- Modify: `src/main.ts`
- Modify: `package.json`
- Modify: `src/style.css`
- Create: `tests/app-shell.test.mjs`

- [ ] **Step 1: Write the failing app rendering test**

```js
// tests/app-shell.test.mjs
import test from "node:test";
import assert from "node:assert/strict";
import { renderHome } from "../dist-test/app.js";

test("renderHome includes locale switcher and featured projects heading", () => {
  const html = renderHome("ko");
  assert.match(html, /data-locale-switcher/);
  assert.match(html, /Featured Projects|주요 프로젝트/);
});
```

- [ ] **Step 2: Implement HTML rendering helpers**

```ts
// src/components/layout.ts
export function renderLayout(content: string) {
  return `
    <div class="site-shell">
      <header class="site-header" data-locale-switcher></header>
      <main>${content}</main>
    </div>
  `;
}
```

```ts
// src/app.ts
import { renderLayout } from "./components/layout";
import type { Locale } from "./lib/routes";

export function renderHome(locale: Locale) {
  const heading = locale === "ko" ? "주요 프로젝트" : "Featured Projects";
  const intro =
    locale === "ko"
      ? "안드로이드 앱 개발자 김병수입니다."
      : "Android developer Kim ByeongSu.";
  return renderLayout(`
    <section class="hero">
      <p class="eyebrow">Kim ByeongSu</p>
      <h1>${intro}</h1>
    </section>
    <section class="section"><h2>${heading}</h2></section>
  `);
}

export function renderNotFound(locale: Locale) {
  const message =
    locale === "ko"
      ? "요청한 페이지를 찾을 수 없습니다."
      : "The requested page could not be found.";

  return renderLayout(`
    <section class="section">
      <h1>${message}</h1>
    </section>
  `);
}
```

- [ ] **Step 3: Wire the route-aware app into `main.ts`**

```ts
// src/main.ts
import "./style.css";
import { renderHome, renderNotFound } from "./app";
import { parseRoute } from "./lib/routes";

const app = document.querySelector<HTMLDivElement>("#app");

if (!app) throw new Error("App root not found");

const route = parseRoute(window.location.pathname);

app.innerHTML =
  route.page === "home" ? renderHome(route.locale) : renderNotFound(route.locale);
```

- [ ] **Step 4: Expand the test build bridge for app rendering**

```json
// package.json scripts addition
{
  "scripts": {
    "pretest": "tsc --outDir dist-test --module ESNext --target ES2022 src/lib/routes.ts src/components/layout.ts src/app.ts"
  }
}
```

- [ ] **Step 5: Add the homepage sections**

```ts
const html = renderLayout(`
  ${renderHero(locale)}
  ${renderFeaturedProjects(locale)}
  ${renderExperience(locale)}
  ${renderAwardsAndEducation(locale)}
  ${renderProjectArchive(locale)}
  ${renderContact(locale)}
`);
```

- [ ] **Step 6: Add shared portfolio styling**

```css
/* src/style.css */
:root {
  --bg: #f4efe7;
  --surface: rgba(255, 255, 255, 0.78);
  --text: #1b1f23;
  --muted: #5f6773;
  --accent: #0057ff;
}

body {
  margin: 0;
  color: var(--text);
  background:
    radial-gradient(circle at top left, #fff6dd 0, transparent 35%),
    linear-gradient(180deg, #f4efe7 0%, #ece6dc 100%);
  font-family: "Pretendard", "Noto Sans KR", sans-serif;
}
```

- [ ] **Step 7: Run verification**

Run: `npm run typecheck`
Expected: PASS

Run: `npm test`
Expected: PASS

Run: `npm run build`
Expected: PASS

- [ ] **Step 8: Commit**

```bash
git add src/app.ts src/components/layout.ts src/components/hero.ts src/components/section.ts src/components/project-card.ts src/main.ts src/style.css tests/app-shell.test.mjs
git commit -m "Turn the content model into a scannable homepage shell" -m "This replaces the placeholder entrypoint with the homepage structure, shared layout, and the first rendering path for the bilingual editorial portfolio." -m "Constraint: Homepage must prioritize recruiter scanability without losing project depth
Confidence: medium
Scope-risk: moderate
Directive: Keep homepage sections concise and push long-form detail into project pages
Tested: npm run typecheck
Tested: npm test
Tested: npm run build
Not-tested: Manual mobile review"
```

### Task 4: Add project detail pages and English fallback labeling

**Files:**
- Create: `src/components/project-detail.ts`
- Modify: `src/app.ts`
- Modify: `package.json`
- Modify: `src/content/projects.ts`
- Modify: `src/lib/content.ts`
- Create: `tests/project-detail.test.mjs`

- [ ] **Step 1: Write the failing project-detail test**

```js
import test from "node:test";
import assert from "node:assert/strict";
import { renderProjectDetail } from "../dist-test/project-detail.js";

test("english project detail shows korean-only notice when deep detail is missing", () => {
  const html = renderProjectDetail({
    locale: "en",
    title: "Mobit",
    summary: "A cryptocurrency paper-trading app",
    detailsAvailable: false
  });

  assert.match(html, /Available in Korean only/);
});
```

- [ ] **Step 2: Implement the project detail renderer**

```ts
// src/components/project-detail.ts
type ProjectDetailInput = {
  locale: "ko" | "en";
  title: string;
  summary: string;
  detailsAvailable: boolean;
};

export function renderProjectDetail(project: ProjectDetailInput) {
  const fallback =
    project.locale === "en" && !project.detailsAvailable
      ? '<p class="language-note">Available in Korean only</p>'
      : "";

  return `
    <article class="project-detail">
      <h1>${project.title}</h1>
      <p>${project.summary}</p>
      ${fallback}
    </article>
  `;
}
```

- [ ] **Step 3: Expand the test build bridge for project-detail rendering**

```json
// package.json scripts addition
{
  "scripts": {
    "pretest": "tsc --outDir dist-test --module ESNext --target ES2022 src/lib/routes.ts src/components/layout.ts src/app.ts src/components/project-detail.ts"
  }
}
```

- [ ] **Step 4: Route project pages through `app.ts`**

```ts
// src/app.ts
if (route.page === "project") {
  const project = getProject(route.slug, route.locale);
  if (!project) return renderNotFound(route.locale);
  return renderLayout(renderProjectDetail(project.copy));
}
```

- [ ] **Step 5: Expand project content with detail availability metadata**

```ts
// project locale shape
en: {
  title: "Mobit",
  summary: "A cryptocurrency paper-trading app",
  detailsAvailable: false
}
```

- [ ] **Step 6: Verify routes and rendering**

Run: `npm test`
Expected: PASS with project detail fallback coverage

Run: `npm run build`
Expected: PASS

- [ ] **Step 7: Commit**

```bash
git add src/components/project-detail.ts src/app.ts src/content/projects.ts src/lib/content.ts tests/project-detail.test.mjs
git commit -m "Preserve portfolio depth without overloading the homepage" -m "This adds project detail rendering and the english fallback label so the site can keep korean as the canonical deep-content version without hiding detail pages from english visitors." -m "Constraint: English content is intentionally partial for some projects
Confidence: high
Scope-risk: moderate
Directive: Use the fallback label only for missing deep detail, not as a substitute for missing basic summaries
Tested: npm test
Tested: npm run build
Not-tested: Manual content QA across all project pages"
```

### Task 5: Populate real portfolio content and finish responsive styling

**Files:**
- Modify: `src/content/site.ts`
- Modify: `src/content/projects.ts`
- Create: `src/content/experience.ts`
- Create: `src/content/awards.ts`
- Create: `src/content/education.ts`
- Modify: `src/style.css`

- [ ] **Step 1: Replace placeholder content with real source-derived portfolio data**

```ts
// example shape in src/content/experience.ts
export const experience = [
  {
    company: "현대오토에버",
    period: "2024.09 ~ 재직중",
    role: "내비게이션 Controller 지도 표시 모듈 개발",
    highlights: [
      "Google Automotive SDK 기반 Android(Kotlin) 개발",
      "Vector Tile 요청 구조 설계 및 개발",
      "EventQueue 구조 설계 및 JNI 작업"
    ]
  }
];
```

- [ ] **Step 2: Add real featured projects and archive entries**

```ts
const featuredSlugs = [
  "connect-s-l-navigation-controller",
  "pad-ai",
  "mobit"
];
```

- [ ] **Step 3: Finish bilingual labels and contact links**

```ts
externalLinks: [
  { label: "Email", href: "mailto:kimbsu3000@gmail.com" },
  { label: "GitHub", href: "https://github.com/kimbsu00" },
  { label: "Blog", href: "https://kimbsu00.oopy.io/" }
]
```

- [ ] **Step 4: Complete responsive styling**

```css
@media (max-width: 900px) {
  .hero-grid,
  .section-grid,
  .project-grid {
    grid-template-columns: 1fr;
  }

  .site-header {
    flex-direction: column;
    align-items: flex-start;
  }
}
```

- [ ] **Step 5: Run verification**

Run: `npm run typecheck`
Expected: PASS

Run: `npm test`
Expected: PASS

Run: `npm run build`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add src/content/site.ts src/content/projects.ts src/content/experience.ts src/content/awards.ts src/content/education.ts src/style.css
git commit -m "Translate the approved structure into real portfolio content" -m "This replaces placeholder copy with the actual experience, awards, education, and project material derived from the source portfolio while preserving the bilingual rules established in the design." -m "Constraint: Preserve source hierarchy while improving scanability
Confidence: medium
Scope-risk: broad
Directive: Treat korean as the source of truth for deep project detail and keep english summaries professionally complete
Tested: npm run typecheck
Tested: npm test
Tested: npm run build
Not-tested: Human proofreading of every localized string"
```

### Task 6: Add GitHub Pages deployment and prepare the branch for PR

**Files:**
- Create: `.github/workflows/deploy.yml`
- Modify: `.gitignore`
- Create: `README.md`

- [ ] **Step 1: Add the GitHub Pages deploy workflow**

```yaml
name: Deploy Pages

on:
  push:
    branches: ["main", "feat/github-io-portfolio-redesign"]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

- [ ] **Step 2: Update ignore rules for the Vite output**

```gitignore
.omx
node_modules
dist
dist-test
```

- [ ] **Step 3: Add a short repository README**

```md
# kimbsu00.github.io

Bilingual Vite-based portfolio site for Kim ByeongSu.

## Commands

- `npm install`
- `npm run dev`
- `npm run typecheck`
- `npm test`
- `npm run build`
```

- [ ] **Step 4: Run final local verification**

Run: `npm run typecheck`
Expected: PASS

Run: `npm test`
Expected: PASS

Run: `npm run build`
Expected: PASS

- [ ] **Step 5: Check branch state and diff**

Run: `git status --short`
Expected: clean working tree

Run: `git log --oneline --decorate --max-count=10`
Expected: feature-branch commits visible in order

- [ ] **Step 6: Commit**

```bash
git add .github/workflows/deploy.yml .gitignore README.md
git commit -m "Prepare the rebuilt portfolio for GitHub Pages delivery" -m "This adds the deployment workflow, repository docs, and final ignore rules so the new portfolio can be built, verified, and published from the feature branch once the repository has a valid main base for PR comparison." -m "Constraint: GitHub Pages deployment must work for a user-site repository
Constraint: A real pull request requires a valid remote main branch
Confidence: high
Scope-risk: moderate
Directive: If origin/main is still missing, initialize or sync the remote default branch before opening the PR
Tested: npm run typecheck
Tested: npm test
Tested: npm run build
Not-tested: End-to-end GitHub Actions deployment on origin"
```
