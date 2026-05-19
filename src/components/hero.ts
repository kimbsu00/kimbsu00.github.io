import { siteContent } from "../content/site.js";
import type { Locale } from "../lib/routes.js";

export function renderHero(locale: Locale) {
  const copy = siteContent[locale];
  const focusPoints = copy.focusPoints
    .map((item) => `<li>${item}</li>`)
    .join("");
  const notesLabel = locale === "ko" ? "포트폴리오 노트" : "Portfolio Notes";

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
