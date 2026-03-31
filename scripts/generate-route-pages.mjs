import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";

function createHtml(locale) {
  const title = locale === "ko" ? "김병수 포트폴리오" : "Kim ByeongSu Portfolio";
  const description =
    locale === "ko"
      ? "안드로이드 앱 개발자 김병수의 이중언어 포트폴리오 사이트"
      : "Bilingual portfolio site for Android developer Kim ByeongSu";

  return `<!doctype html>
<html lang="${locale}">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${title}</title>
    <meta name="description" content="${description}" />
    <script type="module" src="/src/main.ts"></script>
  </head>
  <body>
    <div id="app"></div>
  </body>
</html>
`;
}

const projectSource = await readFile("src/content/projects.ts", "utf8");
const slugs = [...projectSource.matchAll(/slug: "([^"]+)"/g)].map((match) => match[1]);
const locales = ["ko", "en"];

await rm("ko", { recursive: true, force: true });
await rm("en", { recursive: true, force: true });

for (const locale of locales) {
  const rootPath = join(locale, "index.html");
  await mkdir(dirname(rootPath), { recursive: true });
  await writeFile(rootPath, createHtml(locale), "utf8");

  for (const slug of slugs) {
    const routePath = join(locale, "projects", slug, "index.html");
    await mkdir(dirname(routePath), { recursive: true });
    await writeFile(routePath, createHtml(locale), "utf8");
  }
}
