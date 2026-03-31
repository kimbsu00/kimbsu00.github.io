import test from "node:test";
import assert from "node:assert/strict";
import { getProject } from "../dist-test/lib/content.js";
import { normalizePath, parseRoute } from "../dist-test/lib/routes.js";

test("normalizePath defaults root to korean homepage", () => {
  assert.equal(normalizePath("/"), "/ko/");
});

test("parseRoute resolves english project detail paths", () => {
  assert.deepEqual(parseRoute("/en/projects/mobit/"), {
    locale: "en",
    page: "project",
    slug: "mobit"
  });
});

test("getProject returns english project copy", () => {
  const project = getProject("mobit", "en");

  assert.ok(project);
  assert.equal(project.slug, "mobit");
  assert.equal(project.featured, true);
  assert.equal(project.locale, "en");
  assert.equal(project.title, "Mobit");
  assert.equal(project.summary, "A cryptocurrency paper-trading app");
  assert.equal(project.detailsAvailable, false);
});
