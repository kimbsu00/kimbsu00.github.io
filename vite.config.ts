import { readdirSync, statSync } from "node:fs";
import { join, resolve } from "node:path";
import { defineConfig } from "vite";

function collectHtmlFiles(directory: string, bucket: string[] = []) {
  for (const entry of readdirSync(directory)) {
    const fullPath = join(directory, entry);
    const stats = statSync(fullPath);

    if (stats.isDirectory()) {
      collectHtmlFiles(fullPath, bucket);
      continue;
    }

    if (fullPath.endsWith(".html")) {
      bucket.push(fullPath);
    }
  }

  return bucket;
}

function getHtmlInputs() {
  const entries = ["index.html"];

  for (const directory of ["ko", "en"]) {
    try {
      entries.push(...collectHtmlFiles(directory));
    } catch {
      // Route pages are generated before dev/build. Missing directories are fine.
    }
  }

  return Object.fromEntries(entries.map((entry) => [entry, resolve(entry)]));
}

export default defineConfig({
  build: {
    rollupOptions: {
      input: getHtmlInputs()
    }
  },
  server: {
    host: true
  }
});
