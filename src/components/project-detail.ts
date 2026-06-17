import { siteContent } from "../content/site.js";
import type { Locale } from "../lib/routes.js";

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

type ProjectDetailInput = {
  locale: Locale;
  title: string;
  summary: string;
  detailsAvailable: boolean;
  organization: string;
  period: string;
  detailSections: ProjectDetailSection[];
};

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function renderInlineText(value: string) {
  return escapeHtml(value).replace(/`([^`]+)`/g, "<code>$1</code>");
}

function renderImageFigure(image: ProjectMediaImage) {
  const caption = image.caption
    ? `<figcaption>${renderInlineText(image.caption)}</figcaption>`
    : "";

  return `
    <figure class="project-figure">
      <img src="${escapeHtml(image.src)}" alt="${escapeHtml(image.alt)}" loading="lazy" />
      ${caption}
    </figure>
  `;
}

function renderDetailBlock(block: ProjectDetailBlock) {
  switch (block.type) {
    case "paragraph":
      return `<p>${renderInlineText(block.text)}</p>`;
    case "bullet-list":
      return `<ul class="project-highlights">${block.items
        .map((item) => `<li>${renderInlineText(item)}</li>`)
        .join("")}</ul>`;
    case "image":
      return renderImageFigure(block.image);
    case "image-row":
      return `<div class="project-image-row">${block.images
        .map((image) => renderImageFigure(image))
        .join("")}</div>`;
    case "link-list":
      return `<ul class="project-link-list">${block.links
        .map(
          (link) =>
            `<li><a href="${escapeHtml(link.href)}" target="_blank" rel="noreferrer">${renderInlineText(
              link.label
            )}</a></li>`
        )
        .join("")}</ul>`;
    case "divider":
      return `<hr class="project-divider" />`;
  }
}

export function renderProjectDetail(project: ProjectDetailInput) {
  const detailLabel = project.locale === "ko" ? "프로젝트 상세" : "Project Detail";
  const fallback =
    project.locale === "en" && !project.detailsAvailable
      ? `<p class="language-note">${siteContent.en.availabilityLabel}</p>`
      : "";
  const organizationLabel = project.locale === "ko" ? "소속" : "Organization";
  const periodLabel = project.locale === "ko" ? "기간" : "Period";
  const backLabel = project.locale === "ko" ? "목록으로 돌아가기" : "Back to overview";
  const detailSections = project.detailSections
    .map((section) => {
      const blocks = section.blocks.map((block) => renderDetailBlock(block)).join("");

      return `
        <section class="project-section">
          <h2>${renderInlineText(section.title)}</h2>
          ${blocks}
        </section>
      `;
    })
    .join("");

  return `
    <article class="project-detail">
      <p class="eyebrow">${renderInlineText(detailLabel)}</p>
      <h1>${renderInlineText(project.title)}</h1>
      <p class="project-summary">${renderInlineText(project.summary)}</p>
      ${fallback}
      <dl class="project-meta">
        <div>
          <dt>${renderInlineText(organizationLabel)}</dt>
          <dd>${renderInlineText(project.organization)}</dd>
        </div>
        <div>
          <dt>${renderInlineText(periodLabel)}</dt>
          <dd>${renderInlineText(project.period)}</dd>
        </div>
      </dl>
      ${detailSections}
      <p><a href="/${project.locale}/">${renderInlineText(backLabel)}</a></p>
    </article>
  `;
}
