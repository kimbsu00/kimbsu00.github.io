import { siteContent } from "../content/site.js";
import type { Locale } from "../lib/routes.js";

export function renderHero(locale: Locale) {
  const copy = siteContent[locale];
  const tagline =
    locale === "ko"
      ? "기술의 작동 원리를 이해하고 팀의 목표를 공유하는 개발자"
      : "An Android developer who cares about system mechanics and shared team goals";

  return `
    <section class="hero">
      <p class="eyebrow">${copy.englishName}</p>
      <h1>${copy.name}</h1>
      <p class="hero-role">${copy.role}</p>
      <p class="hero-summary">${tagline}</p>
    </section>
  `;
}
