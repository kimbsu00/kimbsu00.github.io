# GitHub.io Notion Detail Fidelity With Media Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the current lightweight project detail pages with full web renditions of the Notion detail pages, preserving all authored text, section order, images, and stable media links.

**Architecture:** Keep the homepage and routing structure intact, but change the project detail content model from summary-oriented sections into a block-based page model. Store media as repo-local assets under `public/assets/projects/<slug>/` and render project pages from structured local content that preserves Notion fidelity without depending on temporary Notion asset URLs.

**Tech Stack:** Vite, TypeScript, vanilla string-template rendering, Node built-in `node:test`, repo-local static assets under `public/`

---

## File Map

- Modify: `tests/project-detail.test.mjs`
- Modify: `src/content/projects.ts`
- Modify: `src/lib/content.ts`
- Modify: `src/components/project-detail.ts`
- Modify: `src/style.css`
- Verify only: `public/assets/projects/connect-s-l-navigation-app/`
- Verify only: `public/assets/projects/pad-ai/`

### Source-Fidelity Rules Locked By This Plan

- Preserve every authored Notion heading, paragraph, and bullet for:
  - `connect-s-l-navigation-app`
  - `diningcode-android-app`
  - `pad-ai`
  - `third-sdk-navigation-app`
- Render local project images from `public/assets/projects/<slug>/...` instead of signed Notion URLs.
- Keep stable external media links such as YouTube demo URLs as explicit link blocks in the rendered page.
- Do not summarize, shorten, or collapse the detail-page body into highlight bullets.
- Keep the homepage card summaries unchanged unless a detail-page implementation step requires a shared type adjustment.

### Target Detail Content Shape

Use this exact block model in `src/content/projects.ts` for detail-page bodies:

```ts
type ProjectMediaImage = {
  src: string;
  alt: string;
  caption?: string;
};

type ProjectDetailBlock =
  | { type: "paragraph"; text: string }
  | { type: "bullet-list"; items: string[] }
  | { type: "image"; image: ProjectMediaImage }
  | { type: "image-row"; images: ProjectMediaImage[] }
  | { type: "link-list"; links: { label: string; href: string }[] }
  | { type: "divider" };

type ProjectDetailSection = {
  title: string;
  blocks: ProjectDetailBlock[];
};
```

Keep the existing summary metadata on each project entry, then replace the current `sections` field with:

```ts
detailSections: ProjectDetailSection[];
```

## Task 1: Freeze Full-Fidelity Detail Behavior In Tests

**Files:**
- Modify: `tests/project-detail.test.mjs`

- [ ] **Step 1: Replace the current lightweight detail-page tests with full-fidelity rendering assertions**

```js
import test from "node:test";
import assert from "node:assert/strict";
import { renderProjectDetail } from "../dist-test/components/project-detail.js";

test("project detail renders headings, images, and link blocks", () => {
  const html = renderProjectDetail({
    locale: "ko",
    title: "PAD-AI",
    summary: "그리기, 영상, 음성 태스크를 통해 검사 데이터를 수집하고 업로드하는 Android 태블릿 애플리케이션 개발을 전담했습니다.",
    detailsAvailable: true,
    organization: "개인",
    period: "2023.03 - 2023.12",
    stack: ["Android", "Kotlin", "CameraX", "OkHttp"],
    highlights: ["고령층 대상 필드 테스트 기반 UX 개선"],
    detailSections: [
      {
        title: "프로젝트 배경",
        blocks: [
          { type: "paragraph", text: "국민건강보험공단과 중앙치매센터의 통계 자료에 따르면, 국내 파킨슨병과 치매 유병률은 꾸준히 증가하고 있습니다." },
          {
            type: "image-row",
            images: [
              {
                src: "/assets/projects/pad-ai/01.png",
                alt: "파킨슨병 및 치매 통계 자료 첫 번째 그래프"
              },
              {
                src: "/assets/projects/pad-ai/02.png",
                alt: "파킨슨병 및 치매 통계 자료 두 번째 그래프"
              }
            ]
          }
        ]
      },
      {
        title: "관련 링크",
        blocks: [
          {
            type: "link-list",
            links: [
              { label: "시연 영상 1", href: "https://youtu.be/1A3JvZItilU" },
              { label: "시연 영상 2", href: "https://youtu.be/KgQlfEHLY94" }
            ]
          }
        ]
      }
    ]
  });

  assert.match(html, /프로젝트 배경/);
  assert.match(html, /assets\/projects\/pad-ai\/01\.png/);
  assert.match(html, /assets\/projects\/pad-ai\/02\.png/);
  assert.match(html, /https:\/\/youtu\.be\/1A3JvZItilU/);
});

test("project detail renders a single-image section and a divider block", () => {
  const html = renderProjectDetail({
    locale: "ko",
    title: "Connect-S\/L 플랫폼 내비게이션 앱 개발",
    summary: "현대자동차 2026년도 양산 차량용 OEM 내비게이션 앱 개발 프로젝트로, 지도 표시 모듈 성능 최적화와 렌더링 구조 설계에 집중했습니다.",
    detailsAvailable: true,
    organization: "현대오토에버",
    period: "2024.09 - 2025.09",
    stack: ["Kotlin", "Android", "Google Automotive SDK", "JNI"],
    highlights: ["Tile 요청 callback 처리 시간 약 60% 개선"],
    detailSections: [
      {
        title: "배경",
        blocks: [
          {
            type: "image",
            image: {
              src: "/assets/projects/connect-s-l-navigation-app/01-google-maps-vector-tile-example.png",
              alt: "Google Maps Vector Tile Example"
            }
          },
          { type: "divider" }
        ]
      }
    ]
  });

  assert.match(html, /connect-s-l-navigation-app\/01-google-maps-vector-tile-example\.png/);
  assert.match(html, /project-divider/);
});
```

- [ ] **Step 2: Run the single test file and verify it fails for the right reason**

Run: `npm test -- tests/project-detail.test.mjs`

Expected: FAIL because the current `ProjectDetailInput` shape still expects `sections` with `paragraphs` and `bullets`, and the current renderer cannot render image blocks, image rows, link lists, or divider blocks.

- [ ] **Step 3: Commit the failing-test checkpoint**

```bash
git add tests/project-detail.test.mjs
git commit -m "Define full Notion-fidelity detail pages as the new rendering contract" -m "These tests lock the project detail pages to a richer block model that includes local images, grouped media rows, and stable external media links from the Notion source." -m "Constraint: Detail pages must preserve Notion-authored content instead of collapsing back into highlight summaries\nRejected: Extend the old paragraphs-plus-bullets renderer incrementally | insufficient for image and media fidelity\nConfidence: high\nScope-risk: narrow\nDirective: Do not remove media assertions to keep the old detail-page shape alive\nTested: npm test -- tests/project-detail.test.mjs\nNot-tested: Typecheck and production build"
```

## Task 2: Move Project Content To A Block-Based Full-Page Model

**Files:**
- Modify: `src/content/projects.ts`
- Modify: `src/lib/content.ts`

- [ ] **Step 1: Introduce the block types at the top of `src/content/projects.ts`**

```ts
type ProjectMediaImage = {
  src: string;
  alt: string;
  caption?: string;
};

type ProjectDetailBlock =
  | { type: "paragraph"; text: string }
  | { type: "bullet-list"; items: string[] }
  | { type: "image"; image: ProjectMediaImage }
  | { type: "image-row"; images: ProjectMediaImage[] }
  | { type: "link-list"; links: { label: string; href: string }[] }
  | { type: "divider" };

type ProjectDetailSection = {
  title: string;
  blocks: ProjectDetailBlock[];
};
```

- [ ] **Step 2: Replace the current `sections` field with `detailSections` on all four projects**

Use this exact shape for `connect-s-l-navigation-app` Korean detail sections:

```ts
detailSections: [
  {
    title: "개요",
    blocks: [
      {
        type: "paragraph",
        text: "현대자동차가 2026년도에 양산 예정인 차량용 OEM 내비게이션 앱 개발 프로젝트입니다. Connect-S/L 플랫폼은 현대자동차 그룹에서 생산하는 차량 중, 제네시스 및 특수 목적 차량을 제외한 대부분의 차량을 의미합니다."
      }
    ]
  },
  {
    title: "담당 업무",
    blocks: [
      {
        type: "bullet-list",
        items: [
          "Connect-S/L 플랫폼 북미 지역 내비게이션 지도 표시 모듈 개발",
          "Google Automotive SDK를 활용한 내비게이션 개발",
          "Vector Tile 데이터 로드 작업 최적화 → 프레임 성능 60% 개선",
          "네이티브 렌더링 SDK를 Kotlin 환경에 통합",
          "렌더링 파이프라인 설계 및 최적화"
        ]
      }
    ]
  },
  {
    title: "기술 스택",
    blocks: [
      {
        type: "bullet-list",
        items: ["Kotlin", "Android", "Google Automotive SDK", "JNI"]
      }
    ]
  },
  {
    title: "1. Tile 데이터 로드 작업 최적화",
    blocks: [
      {
        type: "image",
        image: {
          src: "/assets/projects/connect-s-l-navigation-app/01-google-maps-vector-tile-example.png",
          alt: "Google Maps Vector Tile Example"
        }
      },
      {
        type: "paragraph",
        text: "지도는 여러 개의 Tile 데이터로 구성되며, 사용자가 지도를 이동하거나 확대/축소할 때 필요한 Tile을 지속적으로 로드해야 합니다."
      }
    ]
  }
]
```

Use this exact shape for `pad-ai` Korean image/media sections:

```ts
{
  title: "프로젝트 배경",
  blocks: [
    {
      type: "paragraph",
      text: "국민건강보험공단과 중앙치매센터의 통계 자료에 따르면, 국내 파킨슨병과 치매 유병률은 꾸준히 증가하고 있습니다."
    },
    {
      type: "image-row",
      images: [
        {
          src: "/assets/projects/pad-ai/01.png",
          alt: "파킨슨병 및 치매 통계 자료 첫 번째 그래프"
        },
        {
          src: "/assets/projects/pad-ai/02.png",
          alt: "파킨슨병 및 치매 통계 자료 두 번째 그래프"
        }
      ]
    }
  ]
},
{
  title: "이슈 1 - 음성 태스크 UI/UX 개선",
  blocks: [
    {
      type: "image-row",
      images: [
        {
          src: "/assets/projects/pad-ai/03-음성태스크-화면-ver1.png",
          alt: "음성 태스크 검사 화면 버전 1"
        },
        {
          src: "/assets/projects/pad-ai/04-음성태스크-화면-ver2.png",
          alt: "음성 태스크 검사 화면 버전 2"
        },
        {
          src: "/assets/projects/pad-ai/05-음성태스크-화면-ver3.png",
          alt: "음성 태스크 검사 화면 최종 버전"
        }
      ]
    }
  ]
},
{
  title: "이슈 2 - 영상 태스크 UX 개선",
  blocks: [
    {
      type: "image-row",
      images: [
        {
          src: "/assets/projects/pad-ai/06-영상태스크-시작-화면-ver1.png",
          alt: "기존 영상 태스크 시작 화면"
        },
        {
          src: "/assets/projects/pad-ai/07-영상태스크-손바닥-인식전.png",
          alt: "손바닥 인식 전 영상 태스크 화면"
        },
        {
          src: "/assets/projects/pad-ai/08-영상태스크-손바닥-인식후.png",
          alt: "손바닥 인식 후 영상 태스크 화면"
        }
      ]
    }
  ]
},
{
  title: "관련 링크",
  blocks: [
    {
      type: "link-list",
      links: [
        { label: "시연 영상 1", href: "https://youtu.be/1A3JvZItilU" },
        { label: "시연 영상 2", href: "https://youtu.be/KgQlfEHLY94" }
      ]
    }
  ]
}
```

For `diningcode-android-app` and `third-sdk-navigation-app`, preserve the full text from the fetched Notion pages as `paragraph` and `bullet-list` blocks even if those pages currently have no local images.

- [ ] **Step 3: Update `src/lib/content.ts` to map `detailSections` through unchanged**

```ts
export function getProject(slug: string, locale: Locale) {
  const project = projects.find((entry) => entry.slug === slug);

  if (!project) {
    return null;
  }

  const localized = project.locales[locale];

  return {
    slug: project.slug,
    featured: project.featured,
    locale,
    title: localized.title,
    summary: localized.detailSummary,
    detailsAvailable: localized.detailsAvailable,
    organization: localized.organization,
    period: localized.period,
    stack: [...localized.stack],
    highlights: [...localized.highlights],
    detailSections: localized.detailSections.map((section) => ({
      title: section.title,
      blocks: section.blocks.map((block) => ({ ...block }))
    }))
  };
}
```

- [ ] **Step 4: Run the detail-page test again and verify the failure narrows to the renderer only**

Run: `npm test -- tests/project-detail.test.mjs`

Expected: FAIL because the renderer still reads `sections` with `paragraphs` and `bullets`, but the content and lookup layers now expose `detailSections` with typed blocks.

- [ ] **Step 5: Commit the content-model transition**

```bash
git add src/content/projects.ts src/lib/content.ts
git commit -m "Model project detail pages as full block-based Notion content" -m "This replaces the summary-oriented detail-section model with a block-based page model that can preserve full Notion text, local images, grouped media rows, and stable external media links." -m "Constraint: The deployed site must not depend on expiring Notion asset URLs\nRejected: Keep image URLs inline from fetched Notion HTML | unstable on a static site\nConfidence: high\nScope-risk: moderate\nDirective: New project-page media must live under public/assets/projects/<slug>/ and be referenced locally\nTested: npm test -- tests/project-detail.test.mjs\nNot-tested: Renderer compatibility, full build"
```

## Task 3: Replace The Detail Renderer With A Block Renderer

**Files:**
- Modify: `src/components/project-detail.ts`
- Modify: `src/style.css`

- [ ] **Step 1: Replace `sections` handling with block rendering in `src/components/project-detail.ts`**

```ts
type ProjectDetailBlock =
  | { type: "paragraph"; text: string }
  | { type: "bullet-list"; items: string[] }
  | { type: "image"; image: { src: string; alt: string; caption?: string } }
  | { type: "image-row"; images: { src: string; alt: string; caption?: string }[] }
  | { type: "link-list"; links: { label: string; href: string }[] }
  | { type: "divider" };

type ProjectDetailInput = {
  locale: Locale;
  title: string;
  summary: string;
  detailsAvailable: boolean;
  organization: string;
  period: string;
  stack: string[];
  highlights: string[];
  detailSections: {
    title: string;
    blocks: ProjectDetailBlock[];
  }[];
};

function renderDetailBlock(block: ProjectDetailBlock) {
  if (block.type === "paragraph") {
    return `<p>${block.text}</p>`;
  }

  if (block.type === "bullet-list") {
    return `<ul class="project-highlights">${block.items
      .map((item) => `<li>${item}</li>`)
      .join("")}</ul>`;
  }

  if (block.type === "image") {
    return `
      <figure class="project-figure">
        <img src="${block.image.src}" alt="${block.image.alt}" />
        ${block.image.caption ? `<figcaption>${block.image.caption}</figcaption>` : ""}
      </figure>
    `;
  }

  if (block.type === "image-row") {
    return `
      <div class="project-image-row">
        ${block.images
          .map(
            (image) => `
              <figure class="project-figure">
                <img src="${image.src}" alt="${image.alt}" />
                ${image.caption ? `<figcaption>${image.caption}</figcaption>` : ""}
              </figure>
            `
          )
          .join("")}
      </div>
    `;
  }

  if (block.type === "link-list") {
    return `
      <ul class="project-link-list">
        ${block.links
          .map((link) => `<li><a href="${link.href}" target="_blank" rel="noreferrer">${link.label}</a></li>`)
          .join("")}
      </ul>
    `;
  }

  return `<hr class="project-divider" />`;
}
```

- [ ] **Step 2: Render `detailSections` instead of `sections`**

```ts
const sections = project.detailSections
  .map((section) => {
    const blocks = section.blocks.map(renderDetailBlock).join("");

    return `
      <section class="project-section">
        <h2>${section.title}</h2>
        ${blocks}
      </section>
    `;
  })
  .join("");
```

- [ ] **Step 3: Add the CSS needed for figures, image rows, and media links**

```css
.project-figure {
  display: grid;
  gap: 8px;
  margin: 0;
}

.project-figure img {
  width: 100%;
  display: block;
  border: 1px solid var(--card-rule);
}

.project-figure figcaption {
  color: var(--muted);
  font-size: 0.9rem;
}

.project-image-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
}

.project-link-list {
  display: grid;
  gap: 10px;
  padding-left: 20px;
}

.project-divider {
  border: 0;
  border-top: 1px solid var(--rule);
  margin: 12px 0;
}
```

- [ ] **Step 4: Run the detail-page test and verify it passes**

Run: `npm test -- tests/project-detail.test.mjs`

Expected: PASS

- [ ] **Step 5: Commit the renderer replacement**

```bash
git add src/components/project-detail.ts src/style.css
git commit -m "Render project detail pages as full media-aware Notion pages" -m "The project detail renderer now handles paragraphs, bullet lists, local images, grouped media rows, stable external media links, and divider blocks so the site can publish full Notion-authored project pages." -m "Constraint: Media blocks must render cleanly on static GitHub Pages without client-side Notion parsing\nRejected: Client-side embed of raw Notion page HTML | unstable and harder to maintain\nConfidence: high\nScope-risk: moderate\nDirective: Extend the block renderer for new block types instead of special-casing individual projects\nTested: npm test -- tests/project-detail.test.mjs\nNot-tested: Full site build"
```

## Task 4: Verify Full Notion Fidelity On The Current Local Asset Set

**Files:**
- Verify only: `public/assets/projects/connect-s-l-navigation-app/`
- Verify only: `public/assets/projects/pad-ai/`
- Verify only: `src/content/projects.ts`

- [ ] **Step 1: Verify the current local asset inventory matches the content references**

Run: `find public/assets/projects/connect-s-l-navigation-app -maxdepth 1 -type f | sort`

Expected:

```text
public/assets/projects/connect-s-l-navigation-app/.gitkeep
public/assets/projects/connect-s-l-navigation-app/01-google-maps-vector-tile-example.png
```

Run: `find public/assets/projects/pad-ai -maxdepth 1 -type f | sort`

Expected:

```text
public/assets/projects/pad-ai/.gitkeep
public/assets/projects/pad-ai/01.png
public/assets/projects/pad-ai/02.png
public/assets/projects/pad-ai/03-음성태스크-화면-ver1.png
public/assets/projects/pad-ai/04-음성태스크-화면-ver2.png
public/assets/projects/pad-ai/05-음성태스크-화면-ver3.png
public/assets/projects/pad-ai/06-영상태스크-시작-화면-ver1.png
public/assets/projects/pad-ai/07-영상태스크-손바닥-인식전.png
public/assets/projects/pad-ai/08-영상태스크-손바닥-인식후.png
```

- [ ] **Step 2: Run the full repo verification sequence**

Run: `npm run typecheck`
Expected: PASS

Run: `npm test`
Expected: PASS

Run: `npm run build`
Expected: PASS

- [ ] **Step 3: Manually inspect the rendered pages locally**

Run: `npm run dev`

Open:

```text
http://localhost:5173/ko/projects/connect-s-l-navigation-app/
http://localhost:5173/ko/projects/pad-ai/
http://localhost:5173/ko/projects/diningcode-android-app/
http://localhost:5173/ko/projects/third-sdk-navigation-app/
```

Confirm:
- the sections appear in the same order as the Notion pages
- local images render successfully
- YouTube links appear on `PAD-AI`
- no signed Notion image URLs remain in the page source

- [ ] **Step 4: Commit the fidelity verification pass**

```bash
git add src/content/projects.ts
git commit -m "Verify full-fidelity project pages against local media assets" -m "This verification pass confirms that the current local media set is wired into the full project pages and that the static site no longer depends on temporary Notion-hosted image URLs for the implemented projects." -m "Constraint: Static site media must stay stable after deploy\nRejected: Treat temporary Notion URLs as deployment-ready assets | too fragile for GitHub Pages\nConfidence: medium\nScope-risk: narrow\nDirective: Do not mark diningcode or 3rd SDK as fully media-complete until their local asset sets exist in public/assets/projects/\nTested: npm run typecheck
Tested: npm test
Tested: npm run build
Not-tested: Cross-browser manual QA"
```

## Task 5: Final Delivery Review

**Files:**
- Modify: `src/content/projects.ts`
- Modify: `src/components/project-detail.ts`
- Modify: `src/style.css`

- [ ] **Step 1: Confirm there are no signed Notion image URLs left in the repo**

Run: `rg -n "prod-files-secure|X-Amz-|notion\.so|amazonaws\.com" src public`

Expected: no matches for project-page media references

- [ ] **Step 2: Confirm the current pages still use only the four approved routed projects**

Run: `find ko/projects -maxdepth 1 -mindepth 1 -type d | sort`

Expected:

```text
ko/projects/connect-s-l-navigation-app
ko/projects/diningcode-android-app
ko/projects/pad-ai
ko/projects/third-sdk-navigation-app
```

- [ ] **Step 3: Prepare the final summary**

Include:
- changed files
- which projects now preserve full Notion text
- which projects now render local media
- verification commands and results
- any remaining asset gaps for `diningcode-android-app` and `third-sdk-navigation-app`
