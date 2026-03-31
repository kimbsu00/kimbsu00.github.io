export function renderSection(id: string, title: string, body: string) {
  return `
    <section class="section" id="${id}">
      <div class="section-header">
        <h2>${title}</h2>
      </div>
      ${body}
    </section>
  `;
}
