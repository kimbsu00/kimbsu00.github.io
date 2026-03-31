import { renderHero } from "./components/hero.js";
import { renderLayout } from "./components/layout.js";
import { renderProjectCard } from "./components/project-card.js";
import { renderSection } from "./components/section.js";
import { getFeaturedProjects } from "./lib/content.js";
import type { Locale } from "./lib/routes.js";

export function renderHome(locale: Locale) {
  const sectionTitle = locale === "ko" ? "주요 프로젝트" : "Featured Projects";
  const projects = getFeaturedProjects(locale)
    .map((project) =>
      renderProjectCard({
        title: project.title,
        summary: project.summary,
        href: `/${locale}/projects/${project.slug}/`
      })
    )
    .join("");

  return renderLayout(
    locale,
    `
      ${renderHero(locale)}
      ${renderSection("featured-projects", sectionTitle, `<div class="project-grid">${projects}</div>`)}
    `
  );
}

export function renderNotFound(locale: Locale) {
  const title =
    locale === "ko"
      ? "요청한 페이지를 찾을 수 없습니다."
      : "The requested page could not be found.";

  return renderLayout(locale, renderSection("not-found", title, ""));
}
