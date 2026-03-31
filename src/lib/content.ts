import { projects } from "../content/projects.js";
import type { Locale } from "./routes.js";

export function getProject(slug: string, locale: Locale) {
  const project = projects.find((entry) => entry.slug === slug);

  if (!project) {
    return null;
  }

  return {
    slug: project.slug,
    featured: project.featured,
    locale,
    title: project.locales[locale].title,
    summary: project.locales[locale].summary
  };
}

export function getFeaturedProjects(locale: Locale) {
  return projects
    .filter((entry) => entry.featured)
    .map((project) => ({
      slug: project.slug,
      title: project.locales[locale].title,
      summary: project.locales[locale].summary
    }));
}
