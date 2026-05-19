import { awards } from "./content/awards.js";
import { education } from "./content/education.js";
import { experience } from "./content/experience.js";
import { siteContent } from "./content/site.js";
import { renderHero } from "./components/hero.js";
import { renderLayout } from "./components/layout.js";
import { renderProjectCard } from "./components/project-card.js";
import { renderProjectDetail } from "./components/project-detail.js";
import { renderSection } from "./components/section.js";
import {
  getArchiveProjects,
  getFeaturedProjects,
  getProject
} from "./lib/content.js";
import type { Locale, Route } from "./lib/routes.js";

export function renderHome(locale: Locale) {
  const copy = siteContent[locale];
  const awardsLabel = locale === "ko" ? "수상" : "Awards";
  const educationLabel = locale === "ko" ? "학력" : "Education";
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
  const experienceMarkup = experience
    .map((entry) => {
      const localized = entry.locales[locale];
      const highlights = localized.highlights
        .map((item) => `<li>${item}</li>`)
        .join("");

      return `
        <article class="timeline-item">
          <p class="timeline-period">${entry.period}</p>
          <h3>${localized.company}</h3>
          <p class="timeline-role">${localized.role}</p>
          <p>${localized.summary}</p>
          <ul>${highlights}</ul>
        </article>
      `;
    })
    .join("");
  const awardsMarkup = awards
    .map((entry) => {
      const localized = entry.locales[locale];

      return `
        <article class="mini-card">
          <p class="timeline-period">${entry.period}</p>
          <h3>${localized.title}</h3>
          <p>${localized.summary}</p>
          <p class="mini-meta">${localized.project}</p>
        </article>
      `;
    })
    .join("");
  const educationMarkup = education
    .map((entry) => {
      const localized = entry.locales[locale];

      return `
        <article class="mini-card">
          <p class="timeline-period">${entry.period}</p>
          <h3>${localized.school}</h3>
          <p>${localized.program}</p>
        </article>
      `;
    })
    .join("");
  const contactMarkup = copy.externalLinks
    .map(
      (link) => `
        <li>
          <span>${link.label}</span>
          <a href="${link.href}">${link.display}</a>
        </li>
      `
    )
    .join("");

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
        `<div class="dual-grid">
          <div>
            <h3>${awardsLabel}</h3>
            <div class="mini-grid">${awardsMarkup}</div>
          </div>
          <div>
            <h3>${educationLabel}</h3>
            <div class="mini-grid">${educationMarkup}</div>
          </div>
        </div>`
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

export function renderNotFound(locale: Locale) {
  const title =
    locale === "ko"
      ? "요청한 페이지를 찾을 수 없습니다."
      : "The requested page could not be found.";

  return renderLayout(locale, renderSection("not-found", title, ""));
}

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
