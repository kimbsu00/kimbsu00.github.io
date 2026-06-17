import test from "node:test";
import assert from "node:assert/strict";
import { getProject } from "../dist-test/lib/content.js";
import { normalizePath, parseRoute } from "../dist-test/lib/routes.js";

test("normalizePath defaults root to korean homepage", () => {
  assert.equal(normalizePath("/"), "/ko/");
});

test("parseRoute resolves the new english project detail paths", () => {
  assert.deepEqual(parseRoute("/en/projects/diningcode-android-app/"), {
    locale: "en",
    page: "project",
    slug: "diningcode-android-app"
  });
});

test("getProject returns null for removed legacy projects", () => {
  assert.equal(getProject("mobit", "ko"), null);
  assert.equal(getProject("xp2-navigation-engine-migration", "en"), null);
});

test("getProject keeps the PAD-AI english locale available as a fallback-only page", () => {
  const project = getProject("pad-ai", "en");

  assert.ok(project);
  assert.equal(project.slug, "pad-ai");
  assert.equal(project.featured, true);
  assert.equal(project.locale, "en");
  assert.equal(project.title, "PAD-AI");
  assert.equal(project.organization, "Personal");
  assert.equal(project.period, "2023.03 - 2023.12");
  assert.equal(project.detailsAvailable, false);
  assert.deepEqual(project.detailSections, []);
});

test("abridged english project locales stay marked as unavailable", () => {
  for (const slug of [
    "connect-s-l-navigation-app",
    "diningcode-android-app",
    "pad-ai"
  ]) {
    const project = getProject(slug, "en");

    assert.ok(project);
    assert.equal(project.detailsAvailable, false);
    assert.deepEqual(project.detailSections, []);
  }
});
