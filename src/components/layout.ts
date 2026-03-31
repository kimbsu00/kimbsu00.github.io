import type { Locale } from "../lib/routes.js";

export function renderLayout(locale: Locale, content: string) {
  const labels =
    locale === "ko"
      ? { home: "홈", work: "프로젝트", switchLabel: "언어" }
      : { home: "Home", work: "Projects", switchLabel: "Language" };

  return `
    <div class="site-shell">
      <header class="site-header">
        <a class="site-mark" href="/${locale}/">Kim ByeongSu</a>
        <nav class="site-nav">
          <a href="/${locale}/#featured-projects">${labels.work}</a>
          <a href="/${locale}/#contact">${labels.home}</a>
        </nav>
        <div class="locale-switcher" data-locale-switcher>
          <span>${labels.switchLabel}</span>
          <a href="/ko/">KO</a>
          <a href="/en/">EN</a>
        </div>
      </header>
      <main>${content}</main>
    </div>
  `;
}
