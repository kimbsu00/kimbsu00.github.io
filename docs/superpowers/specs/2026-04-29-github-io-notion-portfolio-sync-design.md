# GitHub.io Notion Portfolio Sync Design Spec

## Goal

Update `kimbsu00.github.io` so the existing bilingual portfolio website reflects the current Notion `포트폴리오` page and its inline `프로젝트` database, while keeping the site's present information architecture and route model.

## Inputs And Constraints

- The source of truth for this change is the Notion page `포트폴리오` and the inline database `프로젝트`.
- The website should keep its current high-level section order:
  1. Hero
  2. Featured Projects
  3. Experience
  4. Awards and Education
  5. Project Archive
  6. Contact
- The site remains bilingual at `/ko/` and `/en/`.
- English content should be updated as an adaptation of the Korean Notion content, not left as the old copy.
- Only projects that are explicitly represented by the Notion portfolio or its project database should remain on the website as project entries.
- Separate project detail routes should remain available for the surviving Notion-backed projects.
- Work that appears only as career context in Notion should remain in experience entries, not be promoted to standalone website projects.
- Missing or placeholder results in Notion must not be expanded into invented claims on the website.

## Verified Source Scope

The fetched Notion homepage provides these top-level content areas:

- Introductory note that the page is written in Korean and that an English version exists
- Identity statement: `안녕하세요 AI-Native 개발자 김병수입니다.`
- Experience
- Inline project database
- Awards
- Education

The verified standalone project pages currently available from the Notion project database are:

- `Connect-S/L 플랫폼 내비게이션 앱 개발`
- `3rd SDK 내비게이션 앱 개발`
- `다이닝코드 안드로이드 앱 개발`
- `PAD-AI`

The Notion homepage also mentions work items that do not currently appear as standalone project database pages, such as:

- `XP2 플랫폼 내비게이션 엔진 마이그레이션`

Those items should stay in experience copy only.

## Recommended Architecture

Keep the current Vite and TypeScript rendering architecture intact. The change should primarily be a structured content replacement, not a rendering rewrite.

Expected code shape after the change:

- `src/content/site.ts`
  - refreshed hero identity and supporting copy
  - localized section labels and contact copy
- `src/content/experience.ts`
  - experience entries rewritten from the current Notion portfolio
- `src/content/awards.ts`
  - awards aligned with the current Notion page wording
- `src/content/education.ts`
  - education aligned with the current Notion page wording
- `src/content/projects.ts`
  - reduced to the Notion-backed project set only
  - each project includes bilingual summary data and route metadata
- existing route parsing and layout components stay in place unless a small content-driven adjustment is required

This preserves the site's maintainability and keeps the diff focused on content and small presentation adjustments.

## Homepage Content Strategy

### Hero

The hero should keep the existing component boundary but use updated copy derived from the Notion introduction.

Content goals:

- present `김병수 / ByeongSu Kim`
- present the current role framing around AI-native and Android/navigation development without inventing claims
- replace older value-statement copy if it no longer matches the current Notion tone
- keep the bilingual experience consistent across `/ko/` and `/en/`

### Experience

Experience should map directly to the current Notion `경력` section.

The verified experience structure is:

- `현대오토에버 (2024.09 ~ 재직중)`
  - `2026년도 양산 차량용 OEM 내비게이션 지도 표시 모듈 개발`
  - `XP2 플랫폼 내비게이션 엔진 마이그레이션`
  - `3rd SDK 내비게이션 엔진 개발`
- `다이닝코드 (2022.01 ~ 2023.02)`
  - `다이닝코드 안드로이드 앱 개발`

Experience entries should remain concise on the homepage. Detailed narrative belongs on project pages where verified detail exists.

### Awards And Education

Awards and education should be updated to match the current Notion phrasing and dates. The current split section can remain because it matches the existing page structure and does not conflict with the source.

### Project Sections

The homepage should only surface the projects represented in the current Notion portfolio system. Legacy archive items that are not present in Notion should be removed from both featured and archive lists.

Because only four projects currently survive the cut, the featured/archive split should be revisited during implementation:

- if the current layout still reads well, all four can be featured and the archive section can be removed or left empty intentionally
- if a split is still useful, it should be based on a clear editorial rule rather than preserving an old arbitrary distinction

The implementation should prefer the cleaner option rather than keeping an empty-feeling archive just because the old structure had one.

## Project Detail Strategy

Project detail routes stay enabled, but only for the verified Notion-backed project set.

Rules for detail pages:

- `Connect-S/L 플랫폼 내비게이션 앱 개발`
  - can support a strong detail page because the Notion source contains substantial verified background, responsibilities, stack, and results
- `다이닝코드 안드로이드 앱 개발`
  - can support a strong detail page because the Notion source contains a long narrative with multiple representative projects and issue summaries
- `PAD-AI`
  - can support a strong detail page because the Notion source contains substantial verified product, UX, and implementation detail
- `3rd SDK 내비게이션 앱 개발`
  - should stay routed, but the website must remain conservative because the Notion source currently contains sparse or placeholder result sections

The site should not fabricate missing metrics, achievements, or polished conclusions for weaker source pages.

## Bilingual Content Rules

- Korean remains the canonical content source.
- English should be updated everywhere impacted by this change.
- English may condense long Korean detail pages for readability, but it should still reflect the current source rather than older website copy.
- If a detail page has shallow or incomplete source material, English should be equally conservative rather than padded.
- Existing `Available in Korean only` behavior can still be used when the English detail version should intentionally stay lightweight, but it should not be used as a shortcut to avoid updating the main English homepage and core project summaries.

## Content Integrity Rules

- Do not preserve older website projects that are no longer represented in the current Notion portfolio.
- Do not invent project outcomes that are absent from the Notion source.
- Do not treat experience bullets as project pages unless a corresponding verified project entry exists.
- Prefer shortening over paraphrased embellishment when adapting long Notion content into card summaries.

## Testing And Verification Expectations

Because this is primarily a content synchronization change, verification should focus on correctness and route integrity:

- typecheck passes
- tests pass
- build passes
- homepage renders correctly in both `/ko/` and `/en/`
- removed project routes no longer appear in generated static routes
- surviving project routes still render valid detail pages

## Risks

- The existing website has a richer local project archive than the current Notion portfolio, so trimming content may require small rendering adjustments to avoid sparse sections.
- English adaptation quality matters because the site is explicitly bilingual; stale English would make the sync incomplete.
- The `3rd SDK` project page currently has incomplete source material, so the implementation must resist over-polishing beyond verified content.
