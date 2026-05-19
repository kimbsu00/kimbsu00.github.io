export function renderSection(id: string, title: string, body: string) {
  const label = id.replace(/-/g, " ");

  return `
    <section class="section" id="${id}">
      <div class="section-header">
        <p class="section-label">${label}</p>
        <h2>${title}</h2>
      </div>
      ${body}
    </section>
  `;
}
