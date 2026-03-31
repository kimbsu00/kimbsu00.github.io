import { siteContent } from "../content/site.js";
import type { Locale } from "../lib/routes.js";

type ProjectDetailInput = {
  locale: Locale;
  title: string;
  summary: string;
  detailsAvailable: boolean;
  highlights: string[];
};

export function renderProjectDetail(project: ProjectDetailInput) {
  const detailLabel = project.locale === "ko" ? "프로젝트 상세" : "Project Detail";
  const fallback =
    project.locale === "en" && !project.detailsAvailable
      ? `<p class="language-note">${siteContent.en.availabilityLabel}</p>`
      : "";

  const highlights = project.highlights
    .map((item) => `<li>${item}</li>`)
    .join("");

  return `
    <article class="project-detail">
      <p class="eyebrow">${detailLabel}</p>
      <h1>${project.title}</h1>
      <p class="project-summary">${project.summary}</p>
      ${fallback}
      <ul class="project-highlights">${highlights}</ul>
      <p><a href="/${project.locale}/">Back to overview</a></p>
    </article>
  `;
}
