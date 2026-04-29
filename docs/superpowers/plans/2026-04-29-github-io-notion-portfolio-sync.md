# GitHub.io Notion Portfolio Sync Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Update the existing bilingual GitHub Pages portfolio so its homepage and project detail pages match the current Notion `포트폴리오` page and inline `프로젝트` database.

**Architecture:** Keep the current Vite + TypeScript site structure, replace the structured content modules with Notion-aligned data, trim the project inventory down to the four verified Notion-backed projects, and expand the existing project-detail renderer so detail pages can show richer verified content while staying conservative for sparse source pages.

**Tech Stack:** Vite, TypeScript, vanilla string-template rendering, Node built-in `node:test`

---

## File Map

- Modify: `tests/routes.test.mjs`
- Modify: `tests/app-shell.test.mjs`
- Modify: `tests/project-detail.test.mjs`
- Modify: `src/content/site.ts`
- Modify: `src/content/experience.ts`
- Modify: `src/content/awards.ts`
- Modify: `src/content/education.ts`
- Modify: `src/content/projects.ts`
- Modify: `src/lib/content.ts`
- Modify: `src/app.ts`
- Modify: `src/components/hero.ts`
- Modify: `src/components/project-detail.ts`
- Verify only: `scripts/generate-route-pages.mjs`

### Data Decisions Locked By This Plan

- Surviving project slugs:
  - `connect-s-l-navigation-app`
  - `third-sdk-navigation-app`
  - `diningcode-android-app`
  - `pad-ai`
- Removed legacy project slugs:
  - `mobit`
  - `xp2-navigation-engine-migration`
  - every existing DiningCode sub-project slug now living only inside the single `diningcode-android-app` detail page
- Homepage project strategy:
  - mark all four surviving projects as featured
  - omit the archive section entirely when there are zero archive projects
- English detail strategy:
  - full detail pages for `connect-s-l-navigation-app`, `diningcode-android-app`, and `pad-ai`
  - intentionally lighter detail for `third-sdk-navigation-app`, with a Korean-only notice if the English write-up stays summary-level

### Target Project Content Shape

Use this shape for each localized project entry in `src/content/projects.ts`:

```ts
type ProjectSection = {
  title: string;
  paragraphs: string[];
  bullets?: string[];
};

type ProjectLocaleContent = {
  title: string;
  cardSummary: string;
  detailSummary: string;
  detailsAvailable: boolean;
  organization: string;
  period: string;
  stack: string[];
  highlights: string[];
  sections: ProjectSection[];
};
```

Keep the root project object shape flat enough for the existing route generator to continue scraping `slug: "..."` values with no script changes.

### Expected Hero Content Shape

Replace the current values-list-driven hero copy with a Notion-aligned note block:

```ts
type SiteLocaleContent = {
  name: string;
  englishName: string;
  role: string;
  heroSummary: string;
  portfolioNote: string;
  focusPoints: string[];
  availabilityLabel: string;
  sectionLabels: {
    featuredProjects: string;
    experience: string;
    awardsEducation: string;
    projectArchive: string;
    contact: string;
  };
  projectCta: string;
  contactLead: string;
  externalLinks: {
    label: string;
    href: string;
    display: string;
  }[];
};
```

## Task 1: Lock The Notion Scope In Tests

**Files:**
- Modify: `tests/routes.test.mjs`
- Modify: `tests/app-shell.test.mjs`
- Modify: `tests/project-detail.test.mjs`

- [ ] **Step 1: Rewrite the route/content tests to encode the new project inventory**

```js
import test from "node:test";
import assert from "node:assert/strict";
import { getProject } from "../dist-test/lib/content.js";
import { normalizePath, parseRoute } from "../dist-test/lib/routes.js";

test("normalizePath defaults root to korean homepage", () => {
  assert.equal(normalizePath("/"), "/ko/");
});

test("parseRoute resolves the new english project detail paths", () => {
  assert.deepEqual(parseRoute("/en/projects/diningcode-android-app/"), {
    locale: "en",
    page: "project",
    slug: "diningcode-android-app"
  });
});

test("getProject returns null for removed legacy projects", () => {
  assert.equal(getProject("mobit", "ko"), null);
  assert.equal(getProject("xp2-navigation-engine-migration", "en"), null);
});

test("getProject returns the verified PAD-AI english copy", () => {
  const project = getProject("pad-ai", "en");

  assert.ok(project);
  assert.equal(project.slug, "pad-ai");
  assert.equal(project.organization, "Personal");
  assert.equal(project.period, "2023.03 - 2023.12");
  assert.match(project.stack.join(", "), /CameraX/);
});
```

- [ ] **Step 2: Rewrite the homepage shell test to enforce the new hero and project scope**

```js
import test from "node:test";
import assert from "node:assert/strict";
import { renderHome } from "../dist-test/app.js";

test("renderHome reflects the Notion-backed korean portfolio scope", () => {
  const html = renderHome("ko");

  assert.match(html, /AI-Native 개발자/);
  assert.match(html, /본 페이지는 한국어로 작성된 포트폴리오입니다/);
  assert.match(html, /Connect-S\/L 플랫폼 내비게이션 앱 개발/);
  assert.match(html, /3rd SDK 내비게이션 앱 개발/);
  assert.match(html, /다이닝코드 안드로이드 앱 개발/);
  assert.match(html, /PAD-AI/);
  assert.doesNotMatch(html, /Mobit/);
  assert.doesNotMatch(html, /프로젝트 아카이브/);
});
```

- [ ] **Step 3: Rewrite the project detail tests to cover both full and conservative detail pages**

```js
import test from "node:test";
import assert from "node:assert/strict";
import { renderProjectDetail } from "../dist-test/components/project-detail.js";

test("full detail pages render stack and named sections", () => {
  const html = renderProjectDetail({
    locale: "ko",
    title: "Connect-S/L 플랫폼 내비게이션 앱 개발",
    summary: "2026년도 양산 차량용 OEM 내비게이션 앱 개발 프로젝트",
    detailsAvailable: true,
    organization: "현대오토에버",
    period: "2024.09 - 2025.09",
    stack: ["Kotlin", "Android", "Google Automotive SDK", "JNI"],
    highlights: ["프레임 성능 60% 개선"],
    sections: [
      {
        title: "주요 성과",
        paragraphs: ["Tile 요청 callback 처리 경로를 최적화했습니다."],
        bullets: ["Tile 요청 callback 처리 시간 약 60% 개선"]
      }
    ]
  });

  assert.match(html, /현대오토에버/);
  assert.match(html, /2024.09 - 2025.09/);
  assert.match(html, /Google Automotive SDK/);
  assert.match(html, /주요 성과/);
});

test("lighter english detail pages keep the korean-only notice", () => {
  const html = renderProjectDetail({
    locale: "en",
    title: "3rd SDK Navigation App Development",
    summary: "PoC navigation app development with HERE SDK.",
    detailsAvailable: false,
    organization: "Hyundai AutoEver",
    period: "2026.03 - Present",
    stack: ["Kotlin", "Android", "HERE SDK"],
    highlights: ["Leading the map display module"],
    sections: []
  });

  assert.match(html, /Available in Korean only/);
  assert.match(html, /HERE SDK/);
});
```

- [ ] **Step 4: Run the targeted tests first and confirm they fail**

Run: `npm test -- tests/routes.test.mjs tests/app-shell.test.mjs tests/project-detail.test.mjs`

Expected: FAIL with assertion mismatches for old slugs, old hero copy, old homepage project inventory, and the current narrower project-detail renderer.

- [ ] **Step 5: Commit the failing-test checkpoint**

```bash
git add tests/routes.test.mjs tests/app-shell.test.mjs tests/project-detail.test.mjs
git commit -m "Define the Notion portfolio as the new test contract" -m "These tests freeze the new project inventory, homepage scope, and full-versus-light detail rendering so the content sync can proceed without carrying forward stale portfolio data." -m "Constraint: The website must drop projects that are no longer represented in the Notion portfolio\nRejected: Keep legacy archive assertions and patch content around them | would preserve the wrong scope\nConfidence: high\nScope-risk: narrow\nDirective: Do not loosen these assertions to accommodate stale local portfolio data\nTested: npm test -- tests/routes.test.mjs tests/app-shell.test.mjs tests/project-detail.test.mjs\nNot-tested: Typecheck and production build"
```

## Task 2: Replace The Global Portfolio Content With Notion-Aligned Data

**Files:**
- Modify: `src/content/site.ts`
- Modify: `src/content/experience.ts`
- Modify: `src/content/awards.ts`
- Modify: `src/content/education.ts`
- Modify: `src/content/projects.ts`
- Modify: `src/lib/content.ts`

- [ ] **Step 1: Rewrite `src/content/site.ts` with Notion-aligned bilingual hero and contact copy**

```ts
export const siteContent = {
  ko: {
    name: "김병수",
    englishName: "ByeongSu Kim",
    role: "AI-Native 개발자",
    heroSummary:
      "차량용 내비게이션과 Android 제품 개발 경험을 바탕으로, 구조 설계와 성능 개선을 함께 다루는 개발자입니다.",
    portfolioNote:
      "본 페이지는 한국어로 작성된 포트폴리오를 바탕으로 구성되었으며, 영어 페이지는 같은 내용을 간결하게 옮긴 버전입니다.",
    focusPoints: [
      "현대오토에버 차량용 내비게이션 개발",
      "다이닝코드 Android 앱 기능 개발 및 구조 개선",
      "PAD-AI 데이터 수집 앱 개발"
    ],
    availabilityLabel: "한국어에서만 더 자세한 설명을 볼 수 있습니다.",
    sectionLabels: {
      featuredProjects: "주요 프로젝트",
      experience: "경력",
      awardsEducation: "수상 및 학력",
      projectArchive: "프로젝트 아카이브",
      contact: "연락처"
    },
    projectCta: "프로젝트 보기",
    contactLead: "이메일, GitHub, 블로그를 통해 연락할 수 있습니다.",
    externalLinks: [
      {
        label: "Email",
        href: "mailto:kimbsu3000@gmail.com",
        display: "kimbsu3000@gmail.com"
      },
      {
        label: "GitHub",
        href: "https://github.com/kimbsu00",
        display: "@kimbsu00"
      },
      {
        label: "Blog",
        href: "https://velog.io/@kimbsu00",
        display: "@kimbsu00"
      }
    ]
  },
  en: {
    name: "Kim ByeongSu",
    englishName: "ByeongSu Kim",
    role: "AI-Native Developer",
    heroSummary:
      "An engineer with Android product and in-vehicle navigation experience, focused on system structure, rendering performance, and delivery quality.",
    portfolioNote:
      "This site mirrors the current Korean portfolio. The English version stays aligned with the same verified project scope in a more concise form.",
    focusPoints: [
      "In-vehicle navigation development at Hyundai AutoEver",
      "Android product work and architecture cleanup at DiningCode",
      "PAD-AI data collection app development"
    ],
    availabilityLabel: "More detailed write-ups are available in Korean.",
    sectionLabels: {
      featuredProjects: "Featured Projects",
      experience: "Experience",
      awardsEducation: "Awards and Education",
      projectArchive: "Project Archive",
      contact: "Contact"
    },
    projectCta: "View project",
    contactLead: "Reach out through email, GitHub, or the portfolio blog.",
    externalLinks: [
      {
        label: "Email",
        href: "mailto:kimbsu3000@gmail.com",
        display: "kimbsu3000@gmail.com"
      },
      {
        label: "GitHub",
        href: "https://github.com/kimbsu00",
        display: "@kimbsu00"
      },
      {
        label: "Blog",
        href: "https://velog.io/@kimbsu00",
        display: "Portfolio Blog"
      }
    ]
  }
} as const;
```

- [ ] **Step 2: Rewrite experience, awards, and education to match the fetched Notion copy**

```ts
export const experience = [
  {
    period: "2024.09 ~ 재직중",
    locales: {
      ko: {
        company: "현대오토에버",
        role: "차량용 내비게이션 개발",
        summary:
          "2026년도 양산 차량용 OEM 내비게이션 지도 표시 모듈 개발, XP2 플랫폼 내비게이션 엔진 마이그레이션, 3rd SDK 내비게이션 엔진 개발에 참여하고 있습니다.",
        highlights: [
          "Connect-S/L 플랫폼 지도 표시 모듈 개발",
          "XP2 플랫폼 내비게이션 엔진 마이그레이션",
          "HERE SDK 기반 3rd SDK 내비게이션 PoC"
        ]
      },
      en: {
        company: "Hyundai AutoEver",
        role: "In-vehicle Navigation Development",
        summary:
          "Working across OEM navigation map rendering, XP2 engine migration, and 3rd-party SDK navigation proof-of-concept work.",
        highlights: [
          "Connect-S/L map display module development",
          "XP2 navigation engine migration",
          "HERE SDK-based third-party navigation PoC"
        ]
      }
    }
  },
  {
    period: "2022.01 ~ 2023.02",
    locales: {
      ko: {
        company: "다이닝코드",
        role: "Android 앱 개발",
        summary:
          "검색, 추천, 평가/체크인, 프로파일/지도, 커뮤니티 안전 기능까지 폭넓은 Android 앱 기능 개발과 화면 개선을 담당했습니다.",
        highlights: [
          "통합검색과 자동완성 구조 설계",
          "레거시 Java/MVC 화면의 Kotlin/MVVM 전환",
          "운영 서비스 안정성 개선"
        ]
      },
      en: {
        company: "DiningCode",
        role: "Android App Development",
        summary:
          "Worked on Android feature delivery and screen improvements across search, recommendations, reviews, map flows, and safety features.",
        highlights: [
          "Integrated search and autocomplete architecture",
          "Java/MVC to Kotlin/MVVM migration",
          "Production stability improvements"
        ]
      }
    }
  }
] as const;
```

```ts
export const awards = [
  {
    period: "2023.11",
    locales: {
      ko: {
        title: "2023 KU SW경진대회 우수상",
        summary:
          "파킨슨병(PD) 및 알츠하이머(AD) 조기 진단을 위한 AI 모델 및 데이터 수집",
        project: "PAD-AI"
      },
      en: {
        title: "2023 KU SW Contest, Excellence Award",
        summary:
          "AI model and data collection for early diagnosis of Parkinson’s disease and Alzheimer’s disease",
        project: "PAD-AI"
      }
    }
  },
  {
    period: "2023.08",
    locales: {
      ko: {
        title: "제1회 건국대학교 해커톤 우수상",
        summary: "나와 다른 MBTI를 이해할 수 있도록 도와주는 프로젝트",
        project: "Hackathon Project"
      },
      en: {
        title: "1st Konkuk University Hackathon, Excellence Award",
        summary: "A project designed to help users understand people with different MBTI types",
        project: "Hackathon Project"
      }
    }
  },
  {
    period: "2021.11",
    locales: {
      ko: {
        title: "공개SW 개발자대회 동상",
        summary: "그래프 색칠하기 병렬 알고리즘",
        project: "Graph Coloring Parallel Algorithm"
      },
      en: {
        title: "Open Source Software Developer Contest, Bronze Prize",
        summary: "Parallel algorithm for graph coloring",
        project: "Graph Coloring Parallel Algorithm"
      }
    }
  },
  {
    period: "2020.10",
    locales: {
      ko: {
        title: "Junction X Seoul 2020 Naver Z Track 3등",
        summary: "Naver Zepeto API를 활용한 지도 기반 SNS 앱",
        project: "Map-based SNS App"
      },
      en: {
        title: "Junction X Seoul 2020, Naver Z Track 3rd Place",
        summary: "A map-based social app using the Naver Zepeto API",
        project: "Map-based SNS App"
      }
    }
  }
] as const;
```

```ts
export const education = [
  {
    period: "2018.03 ~ 2024.08",
    locales: {
      ko: {
        school: "건국대학교",
        program: "공과대학 소프트웨어학과"
      },
      en: {
        school: "Konkuk University",
        program: "B.S. in Software Engineering"
      }
    }
  },
  {
    period: "2015.03 ~ 2018.02",
    locales: {
      ko: {
        school: "병점고등학교",
        program: "자연계 졸업"
      },
      en: {
        school: "Byeongjeom High School",
        program: "Natural Sciences Track"
      }
    }
  }
] as const;
```

- [ ] **Step 3: Rewrite `src/content/projects.ts` to the four-project Notion-backed set**

```ts
export const projects = [
  {
    slug: "connect-s-l-navigation-app",
    featured: true,
    locales: {
      ko: {
        title: "Connect-S/L 플랫폼 내비게이션 앱 개발",
        cardSummary: "2026년도 양산 차량용 OEM 내비게이션 앱 개발 프로젝트",
        detailSummary:
          "현대자동차 2026년도 양산 차량용 OEM 내비게이션 앱 개발 프로젝트로, 지도 표시 모듈 성능 최적화와 렌더링 구조 설계에 집중했습니다.",
        detailsAvailable: true,
        organization: "현대오토에버",
        period: "2024.09 - 2025.09",
        stack: ["Kotlin", "Android", "Google Automotive SDK", "JNI"],
        highlights: [
          "Tile 요청 callback 처리 시간 약 60% 개선",
          "프레임 단위 일관성을 보장하는 렌더링 파이프라인 설계",
          "네이티브 렌더링 SDK의 Kotlin 중심 통합"
        ],
        sections: [
          {
            title: "개요",
            paragraphs: [
              "현대자동차가 2026년도에 양산 예정인 차량용 OEM 내비게이션 앱 개발 프로젝트입니다."
            ]
          },
          {
            title: "담당 업무",
            paragraphs: [],
            bullets: [
              "Connect-S/L 플랫폼 북미 지역 내비게이션 지도 표시 모듈 개발",
              "Vector Tile 데이터 로드 작업 최적화",
              "네이티브 렌더링 SDK Kotlin 통합"
            ]
          }
        ]
      },
      en: {
        title: "Connect-S/L Navigation App Development",
        cardSummary: "OEM navigation app development for 2026 production vehicles.",
        detailSummary:
          "Worked on the map display module of an OEM navigation app, with emphasis on rendering performance and a maintainable Kotlin-facing architecture.",
        detailsAvailable: true,
        organization: "Hyundai AutoEver",
        period: "2024.09 - 2025.09",
        stack: ["Kotlin", "Android", "Google Automotive SDK", "JNI"],
        highlights: [
          "Improved tile callback handling time by roughly 60%",
          "Designed frame-consistent rendering command flow",
          "Integrated a native rendering SDK into a Kotlin-centric structure"
        ],
        sections: [
          {
            title: "Overview",
            paragraphs: [
              "An OEM navigation app project for upcoming Hyundai Motor Group vehicles."
            ]
          },
          {
            title: "Key Work",
            paragraphs: [],
            bullets: [
              "Map display module development for the Connect-S/L platform",
              "Vector tile load-path optimization",
              "Kotlin integration for the native rendering SDK"
            ]
          }
        ]
      }
    }
  },
  {
    slug: "third-sdk-navigation-app",
    featured: true,
    locales: {
      ko: {
        title: "3rd SDK 내비게이션 앱 개발",
        cardSummary: "HERE SDK를 활용한 내비게이션 앱 개발 PoC 프로젝트",
        detailSummary:
          "HERE SDK를 활용해 3rd-party navigation SDK 기반 앱 개발 가능성을 검증하는 PoC 프로젝트입니다.",
        detailsAvailable: true,
        organization: "현대오토에버",
        period: "2026.03 - 재직중",
        stack: ["Kotlin", "Android", "HERE SDK"],
        highlights: [
          "HERE SDK 기반 내비게이션 개발",
          "지도 표시 모듈 개발 리딩",
          "지도 표시 모듈 maven 배포 환경 구축"
        ],
        sections: [
          {
            title: "개요",
            paragraphs: [
              "현대오토에버 자체 엔진이 아닌 외부 SDK를 활용한 내비게이션 앱 개발 가능성을 검증하는 프로젝트입니다."
            ]
          }
        ]
      },
      en: {
        title: "3rd SDK Navigation App Development",
        cardSummary: "A navigation proof of concept built with HERE SDK.",
        detailSummary:
          "A proof-of-concept project exploring navigation app development on top of HERE SDK.",
        detailsAvailable: false,
        organization: "Hyundai AutoEver",
        period: "2026.03 - Present",
        stack: ["Kotlin", "Android", "HERE SDK"],
        highlights: [
          "Navigation development with HERE SDK",
          "Leading the map display module",
          "Setting up Maven distribution for the map display module"
        ],
        sections: []
      }
    }
  },
  {
    slug: "diningcode-android-app",
    featured: true,
    locales: {
      ko: {
        title: "다이닝코드 안드로이드 앱 개발",
        cardSummary: "검색, 추천, 평가/체크인, 프로파일/지도 기능을 개선한 Android 앱 개발 이력",
        detailSummary:
          "다이닝코드 Android 앱의 핵심 사용자 경험을 개선하며 검색, 추천, 평가, 지도, 안정성 영역을 폭넓게 다룬 작업입니다.",
        detailsAvailable: true,
        organization: "다이닝코드",
        period: "2022.01 - 2023.02",
        stack: [
          "Android",
          "Kotlin",
          "Java",
          "XML",
          "MVVM",
          "ViewModel",
          "LiveData",
          "Coroutine",
          "Glide",
          "Naver Map"
        ],
        highlights: [
          "통합검색과 자동완성 구조 설계",
          "레거시 Java/MVC 화면의 Kotlin/MVVM 전환",
          "운영 서비스 안정성 및 UX 개선"
        ],
        sections: [
          {
            title: "개요",
            paragraphs: [
              "다이닝코드에서 Android 앱 기능 개발과 화면 개선 작업을 진행했습니다."
            ]
          },
          {
            title: "대표 작업",
            paragraphs: [],
            bullets: [
              "검색 탭 리뉴얼",
              "통합검색 자동완성 기능 개발",
              "추천 탭 개발",
              "맛집 평가 화면 기능 개선",
              "프로파일 및 지도 화면 개선"
            ]
          }
        ]
      },
      en: {
        title: "DiningCode Android App Development",
        cardSummary: "Android product work across search, recommendations, reviews, maps, and reliability.",
        detailSummary:
          "Worked on major user-facing Android flows at DiningCode, from search and recommendations to reviews, maps, and platform-specific reliability issues.",
        detailsAvailable: true,
        organization: "DiningCode",
        period: "2022.01 - 2023.02",
        stack: [
          "Android",
          "Kotlin",
          "Java",
          "XML",
          "MVVM",
          "ViewModel",
          "LiveData",
          "Coroutine",
          "Glide",
          "Naver Map"
        ],
        highlights: [
          "Integrated search and autocomplete architecture",
          "Java/MVC to Kotlin/MVVM migrations",
          "UI, map, and production stability improvements"
        ],
        sections: [
          {
            title: "Overview",
            paragraphs: [
              "Handled Android feature delivery and screen improvements across search, recommendations, reviews, profile, and map flows."
            ]
          },
          {
            title: "Representative Work",
            paragraphs: [],
            bullets: [
              "Search tab renewal and state restoration fixes",
              "Autocomplete concurrency and performance improvements",
              "Recommendation tab UX and nested scrolling refinements",
              "Review-flow architecture cleanup",
              "Map SDK and navigation integration work"
            ]
          }
        ]
      }
    }
  },
  {
    slug: "pad-ai",
    featured: true,
    locales: {
      ko: {
        title: "PAD-AI",
        cardSummary: "파킨슨병 및 알츠하이머 조기 진단을 위한 데이터 수집용 Android 태블릿 앱",
        detailSummary:
          "그리기, 영상, 음성 태스크를 통해 검사 데이터를 수집하고 업로드하는 Android 태블릿 애플리케이션 개발을 전담했습니다.",
        detailsAvailable: true,
        organization: "개인",
        period: "2023.03 - 2023.12",
        stack: [
          "Android",
          "Kotlin",
          "Coroutine",
          "MVVM",
          "ViewModel",
          "LiveData",
          "CameraX",
          "OkHttp"
        ],
        highlights: [
          "고령층 대상 필드 테스트 기반 UX 개선",
          "CameraX 기반 영상 태스크와 손 위치 인식 구현",
          "업로드 실패 데이터 복구 흐름 구현"
        ],
        sections: [
          {
            title: "개요",
            paragraphs: [
              "파킨슨병과 알츠하이머 조기 진단을 보조하기 위한 데이터 수집용 Android 태블릿 애플리케이션입니다."
            ]
          },
          {
            title: "핵심 구현",
            paragraphs: [],
            bullets: [
              "스타일러스 기반 그리기 기능",
              "CameraX 기반 영상 녹화",
              "음성 재생 및 녹음",
              "multipart 업로드 및 재업로드 복구"
            ]
          }
        ]
      },
      en: {
        title: "PAD-AI",
        cardSummary: "An Android tablet app for collecting diagnostic task data for Parkinson’s and Alzheimer’s research.",
        detailSummary:
          "Led development of the Android tablet app used to collect drawing, video, and voice task data for early-diagnosis research workflows.",
        detailsAvailable: true,
        organization: "Personal",
        period: "2023.03 - 2023.12",
        stack: [
          "Android",
          "Kotlin",
          "Coroutine",
          "MVVM",
          "ViewModel",
          "LiveData",
          "CameraX",
          "OkHttp"
        ],
        highlights: [
          "Field-test-driven UX improvements for older users",
          "Video-task flow using hand-position recognition",
          "Reliable upload and retry flow for collected assets"
        ],
        sections: [
          {
            title: "Overview",
            paragraphs: [
              "An Android tablet app for collecting drawing, video, and voice data used in early-diagnosis support workflows."
            ]
          },
          {
            title: "Key Work",
            paragraphs: [],
            bullets: [
              "Stylus-based drawing task implementation",
              "CameraX recording workflow",
              "Voice playback and recording flow",
              "Multipart upload and failed-upload recovery"
            ]
          }
        ]
      }
    }
  }
] as const;
```

- [ ] **Step 4: Update `src/lib/content.ts` to map the richer project model and preserve conditional archive lookups**

```ts
import { projects } from "../content/projects.js";
import type { Locale } from "./routes.js";

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
    sections: localized.sections.map((section) => ({
      title: section.title,
      paragraphs: [...section.paragraphs],
      bullets: section.bullets ? [...section.bullets] : []
    }))
  };
}

export function getFeaturedProjects(locale: Locale) {
  return projects
    .filter((entry) => entry.featured)
    .map((project) => ({
      slug: project.slug,
      title: project.locales[locale].title,
      summary: project.locales[locale].cardSummary
    }));
}

export function getArchiveProjects(locale: Locale) {
  return projects
    .filter((entry) => !entry.featured)
    .map((project) => ({
      slug: project.slug,
      title: project.locales[locale].title,
      summary: project.locales[locale].cardSummary
    }));
}
```

- [ ] **Step 5: Run the targeted tests again and confirm the pure content changes fix the route/content assertions but not yet the richer detail rendering**

Run: `npm test -- tests/routes.test.mjs tests/app-shell.test.mjs tests/project-detail.test.mjs`

Expected:
- `tests/routes.test.mjs`: PASS
- `tests/app-shell.test.mjs`: still FAIL until the hero/archive rendering is updated
- `tests/project-detail.test.mjs`: still FAIL until the detail renderer is expanded

- [ ] **Step 6: Commit the content-model rewrite**

```bash
git add src/content/site.ts src/content/experience.ts src/content/awards.ts src/content/education.ts src/content/projects.ts src/lib/content.ts
git commit -m "Replace stale portfolio data with the current Notion-backed content model" -m "This rewrites the structured content modules around the current Notion portfolio and trims the local project inventory to the four verified project pages that should remain on the public site." -m "Constraint: No new dependencies and no synthetic project copy beyond verified Notion material\nRejected: Keep the older broader project archive and reinterpret it as current | violates the approved scope\nConfidence: high\nScope-risk: moderate\nDirective: Add new public portfolio projects only when they exist in the Notion portfolio system first\nTested: npm test -- tests/routes.test.mjs tests/app-shell.test.mjs tests/project-detail.test.mjs\nNot-tested: Full homepage rendering, production build"
```

## Task 3: Update Homepage Rendering For The New Hero And Zero-Archive State

**Files:**
- Modify: `src/components/hero.ts`
- Modify: `src/app.ts`

- [ ] **Step 1: Update the hero renderer to use `portfolioNote` and `focusPoints` instead of the old value statements**

```ts
import { siteContent } from "../content/site.js";
import type { Locale } from "../lib/routes.js";

export function renderHero(locale: Locale) {
  const copy = siteContent[locale];
  const notesLabel = locale === "ko" ? "Portfolio Notes" : "Portfolio Notes";
  const focusPoints = copy.focusPoints.map((item) => `<li>${item}</li>`).join("");

  return `
    <section class="hero">
      <div class="hero-copy">
        <p class="eyebrow">${copy.englishName}</p>
        <h1>${copy.name}</h1>
        <p class="hero-role">${copy.role}</p>
        <p class="hero-summary">${copy.heroSummary}</p>
      </div>
      <aside class="hero-notes">
        <p class="section-label">${notesLabel}</p>
        <p class="hero-summary">${copy.portfolioNote}</p>
        <ul class="hero-values">${focusPoints}</ul>
      </aside>
    </section>
  `;
}
```

- [ ] **Step 2: Make the homepage omit the archive section when no archive projects exist**

```ts
export function renderHome(locale: Locale) {
  const copy = siteContent[locale];
  const featuredProjects = getFeaturedProjects(locale)
    .map((project) =>
      renderProjectCard({
        title: project.title,
        summary: project.summary,
        href: `/${locale}/projects/${project.slug}/`,
        ctaLabel: copy.projectCta
      })
    )
    .join("");
  const archiveProjects = getArchiveProjects(locale)
    .map((project) =>
      renderProjectCard({
        title: project.title,
        summary: project.summary,
        href: `/${locale}/projects/${project.slug}/`,
        ctaLabel: copy.projectCta
      })
    )
    .join("");
  const archiveSection =
    archiveProjects.length === 0
      ? ""
      : renderSection(
          "project-archive",
          copy.sectionLabels.projectArchive,
          `<div class="project-grid">${archiveProjects}</div>`
        );

  return renderLayout(
    locale,
    `
      ${renderHero(locale)}
      ${renderSection(
        "featured-projects",
        copy.sectionLabels.featuredProjects,
        `<div class="project-grid">${featuredProjects}</div>`
      )}
      ${renderSection(
        "experience",
        copy.sectionLabels.experience,
        `<div class="timeline-grid">${experienceMarkup}</div>`
      )}
      ${renderSection(
        "awards-education",
        copy.sectionLabels.awardsEducation,
        `<div class="dual-grid">${awardsEducationMarkup}</div>`
      )}
      ${archiveSection}
      ${renderSection(
        "contact",
        copy.sectionLabels.contact,
        `<p class="contact-lead">${copy.contactLead}</p><ul class="contact-list">${contactMarkup}</ul>`
      )}
    `
  );
}
```

- [ ] **Step 3: Re-run the homepage and route tests**

Run: `npm test -- tests/routes.test.mjs tests/app-shell.test.mjs`

Expected: PASS

- [ ] **Step 4: Commit the homepage rendering update**

```bash
git add src/components/hero.ts src/app.ts
git commit -m "Align the homepage shell with the current Notion portfolio" -m "The homepage now uses Notion-aligned hero copy and drops the empty archive section when the surviving project set is fully featured, keeping the layout clean after the project inventory trim." -m "Constraint: Keep the current information architecture without preserving empty sections for historical reasons\nRejected: Leave the archive section visible with no cards | reads as broken after the approved scope reduction\nConfidence: high\nScope-risk: narrow\nDirective: If archive projects return in the future, re-enable the section by data rather than hardcoding it back in\nTested: npm test -- tests/routes.test.mjs tests/app-shell.test.mjs\nNot-tested: Full production build"
```

## Task 4: Expand Project Detail Pages To Match Verified Notion Depth

**Files:**
- Modify: `src/components/project-detail.ts`
- Modify: `src/app.ts`
- Modify: `tests/project-detail.test.mjs`

- [ ] **Step 1: Expand `renderProjectDetail` to render metadata, stack, highlights, and named sections**

```ts
import { siteContent } from "../content/site.js";
import type { Locale } from "../lib/routes.js";

type ProjectDetailInput = {
  locale: Locale;
  title: string;
  summary: string;
  detailsAvailable: boolean;
  organization: string;
  period: string;
  stack: string[];
  highlights: string[];
  sections: {
    title: string;
    paragraphs: string[];
    bullets: string[];
  }[];
};

export function renderProjectDetail(project: ProjectDetailInput) {
  const detailLabel = project.locale === "ko" ? "프로젝트 상세" : "Project Detail";
  const fallback =
    project.locale === "en" && !project.detailsAvailable
      ? `<p class="language-note">${siteContent.en.availabilityLabel}</p>`
      : "";
  const stackMarkup = project.stack.map((item) => `<li>${item}</li>`).join("");
  const highlights = project.highlights.map((item) => `<li>${item}</li>`).join("");
  const sections = project.sections
    .map((section) => {
      const paragraphs = section.paragraphs.map((item) => `<p>${item}</p>`).join("");
      const bullets =
        section.bullets.length === 0
          ? ""
          : `<ul class="project-highlights">${section.bullets
              .map((item) => `<li>${item}</li>`)
              .join("")}</ul>`;

      return `
        <section class="project-section">
          <h2>${section.title}</h2>
          ${paragraphs}
          ${bullets}
        </section>
      `;
    })
    .join("");

  return `
    <article class="project-detail">
      <p class="eyebrow">${detailLabel}</p>
      <h1>${project.title}</h1>
      <p class="project-summary">${project.summary}</p>
      ${fallback}
      <dl class="project-meta">
        <div><dt>${project.locale === "ko" ? "소속" : "Organization"}</dt><dd>${project.organization}</dd></div>
        <div><dt>${project.locale === "ko" ? "기간" : "Period"}</dt><dd>${project.period}</dd></div>
      </dl>
      <section class="project-section">
        <h2>${project.locale === "ko" ? "기술 스택" : "Tech Stack"}</h2>
        <ul class="project-stack">${stackMarkup}</ul>
      </section>
      <section class="project-section">
        <h2>${project.locale === "ko" ? "핵심 포인트" : "Highlights"}</h2>
        <ul class="project-highlights">${highlights}</ul>
      </section>
      ${sections}
      <p><a href="/${project.locale}/">Back to overview</a></p>
    </article>
  `;
}
```

- [ ] **Step 2: Pass the richer project payload through unchanged from `renderApp()`**

```ts
export function renderApp(route: Route) {
  if (route.page === "home") {
    return renderHome(route.locale);
  }

  const project = getProject(route.slug, route.locale);

  if (!project) {
    return renderNotFound(route.locale);
  }

  return renderLayout(route.locale, renderProjectDetail(project));
}
```

No structural change is needed here if `getProject()` already returns the expanded shape. Keep this file untouched unless the compiler forces an explicit type adjustment.

- [ ] **Step 3: Re-run the detail test suite**

Run: `npm test -- tests/project-detail.test.mjs`

Expected: PASS

- [ ] **Step 4: Re-run the full local verification sequence**

Run: `npm run generate:routes`
Expected: PASS and regenerate only these directories under both locales:
- `connect-s-l-navigation-app`
- `third-sdk-navigation-app`
- `diningcode-android-app`
- `pad-ai`

Run: `npm run typecheck`
Expected: PASS

Run: `npm test`
Expected: PASS

Run: `npm run build`
Expected: PASS

- [ ] **Step 5: Spot-check generated route pruning**

Run: `find ko/projects -maxdepth 1 -mindepth 1 -type d | sort`

Expected:

```text
ko/projects/connect-s-l-navigation-app
ko/projects/diningcode-android-app
ko/projects/pad-ai
ko/projects/third-sdk-navigation-app
```

Run: `find en/projects -maxdepth 1 -mindepth 1 -type d | sort`

Expected:

```text
en/projects/connect-s-l-navigation-app
en/projects/diningcode-android-app
en/projects/pad-ai
en/projects/third-sdk-navigation-app
```

- [ ] **Step 6: Commit the detail-page expansion and verification**

```bash
git add src/components/project-detail.ts src/app.ts ko en
git commit -m "Bring project detail pages in line with the verified Notion writeups" -m "Project pages now expose the richer metadata, stack, and sectioned narratives available in Notion while staying intentionally lightweight for the sparse 3rd SDK page." -m "Constraint: Do not invent outcomes for source pages that are still incomplete in Notion\nRejected: Keep the old one-paragraph detail template | loses too much verified detail from the surviving projects\nConfidence: high\nScope-risk: moderate\nDirective: Expand detail pages only from verified source material, not from memory or older portfolio revisions\nTested: npm run generate:routes
Tested: npm run typecheck
Tested: npm test
Tested: npm run build
Not-tested: Browser QA beyond static HTML generation"
```

## Task 5: Final Review And Delivery Notes

**Files:**
- Modify if needed after verification: `src/content/*.ts`, `src/components/*.ts`

- [ ] **Step 1: Review the diff for stale legacy names**

Run: `rg -n "Mobit|xp2-navigation-engine-migration|diningcode-search-autocomplete|diningcode-report-block" src tests ko en`

Expected: no remaining matches

- [ ] **Step 2: Review the diff for unintended archive leakage**

Run: `rg -n "프로젝트 아카이브|Project Archive" src/app.ts tests/app-shell.test.mjs`

Expected:
- `src/app.ts`: label only, inside the conditional archive-section path
- `tests/app-shell.test.mjs`: negative assertion proving the empty section is omitted

- [ ] **Step 3: Prepare the final summary**

Include:
- changed files
- removed legacy projects
- surviving routed projects
- verification commands and results
- remaining risk that `3rd SDK` detail depth is intentionally limited by the current Notion source
