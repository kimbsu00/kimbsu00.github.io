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
    detailSections: localized.detailSections.map((section) => ({
      title: section.title,
      blocks: section.blocks.map((block) => {
        switch (block.type) {
          case "paragraph":
            return { ...block };
          case "bullet-list":
            return { type: block.type, items: [...block.items] };
          case "image":
            return { type: block.type, image: { ...block.image } };
          case "image-row":
            return {
              type: block.type,
              images: block.images.map((image) => ({ ...image }))
            };
          case "link-list":
            return {
              type: block.type,
              links: block.links.map((link) => ({ ...link }))
            };
          case "divider":
            return { type: block.type };
        }
      })
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
