type ProjectCardInput = {
  title: string;
  summary: string;
  href: string;
};

export function renderProjectCard(project: ProjectCardInput) {
  return `
    <article class="project-card">
      <h3>${project.title}</h3>
      <p>${project.summary}</p>
      <a href="${project.href}">View project</a>
    </article>
  `;
}
