import { siteContent } from "../content/site.js";
import type { Locale } from "../lib/routes.js";

export function renderHero(locale: Locale) {
  const copy = siteContent[locale];
  const valueStatements = copy.valueStatements
    .map((item) => `<li>${item}</li>`)
    .join("");

  return `
    <section class="hero">
      <p class="eyebrow">${copy.englishName}</p>
      <h1>${copy.name}</h1>
      <p class="hero-role">${copy.role}</p>
      <p class="hero-summary">${copy.heroSummary}</p>
      <ul class="hero-values">${valueStatements}</ul>
    </section>
  `;
}
