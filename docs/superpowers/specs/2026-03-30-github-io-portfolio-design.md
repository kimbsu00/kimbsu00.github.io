# GitHub.io Portfolio Redesign Design Spec

## Goal

Rebuild `https://kimbsu00.oopy.io/portfolio` as a custom GitHub Pages portfolio site that preserves the existing content while redesigning the presentation for a stronger recruiter-facing and developer-facing experience.

## Inputs And Constraints

- Source content comes from `https://kimbsu00.oopy.io/portfolio`.
- The new site should keep the current content hierarchy, but not the current Notion/Oopy presentation.
- The site should target recruiters / hiring managers and developer peers.
- The site should use a shared bilingual design with `/ko/` and `/en/`.
- Korean is the canonical full-content version.
- English should mirror the major sections, while some deeper project details may be replaced with `Available in Korean only`.
- The implementation must be done on a new branch and ultimately prepared as a pull request into `main`.
- A plan markdown file must exist before implementation begins.

## Source Hierarchy Summary

The source page currently contains:

- Intro / identity
- Developer values and working style statements
- Quick profile links
- Experience
- Awards
- Education
- A large project archive with detailed writeups

The source also contains project-specific deep content for work at Hyundai AutoEver, DiningCode, and personal / competition projects such as PAD-AI, MZTI, Mobit, and Zepetalk.

## Recommended Information Architecture

Both language versions should share this homepage structure:

1. Hero
2. Featured Projects
3. Experience
4. Awards and Education
5. Project Archive
6. Contact and External Links

This is an editorial portfolio structure rather than an archive-first or resume-first structure. The homepage should be optimized for scanning and first impressions. Deeper project material should move into dedicated project detail pages.

## Content Reconstruction Strategy

The new site should preserve the source content but normalize it into structured data. Each content area should be represented as reusable fields instead of long, page-specific blocks.

Suggested content entities:

- `profile`
  - name
  - role
  - intro
  - value statements
  - external links
- `experience`
  - company
  - period
  - role
  - summary
  - contributions
  - stack
- `award`
  - date
  - title
  - project
  - summary
- `education`
  - institution
  - period
  - program
- `project`
  - slug
  - title
  - period
  - category
  - organization
  - summary
  - role
  - contributions
  - stack
  - feature bullets
  - issue / deep-dive sections
  - links
  - language availability

## Bilingual Rules

- `/ko/` contains the full experience.
- `/en/` contains the same top-level structure and the most important professional content.
- When a project includes deeper narrative detail that is not translated, the English page should explicitly display `Available in Korean only`.
- Navigation, section names, metadata, and calls to action should be localized in both languages.
- The visual design, spacing, and component structure should remain shared across both languages.

## UX Direction

The new site should feel like a deliberate developer portfolio rather than a document export.

Design priorities:

- strong first-screen hero
- clean visual hierarchy
- easy scanability
- mobile-friendly layout
- fast loading on GitHub Pages
- clear transition from summary content to detailed project pages

The strongest project and career evidence should appear above the fold or shortly after it. The archive should remain accessible without making the homepage feel like a long scrolling document dump.

## Technical Direction

Use a Vite-based static site. The implementation should favor a small, maintainable stack with reusable components and structured content files.

Expected technical shape:

- Vite app for static build output
- route handling for `/ko/` and `/en/`
- shared layout and design system
- structured local data files for portfolio content
- reusable sections for hero, timeline, cards, and project details
- GitHub Pages deployment via GitHub Actions

Because the repository name is `kimbsu00.github.io`, the deployment target is the user site root rather than a project subpath.

## Delivery Shape

Implementation should proceed in this order:

1. Design spec
2. Implementation plan
3. Site scaffold and content model
4. Bilingual page implementation
5. GitHub Pages deployment workflow
6. Verification
7. Pull request preparation

## Risks And Notes

- The source portfolio is content-rich, so the main execution risk is preserving structure while improving clarity.
- English content depth must be curated to avoid partial or inconsistent translations.
- A real GitHub pull request requires a valid remote `main` branch as the base branch.
