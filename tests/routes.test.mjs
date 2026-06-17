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

test("getProject exposes full english detail for the third-party navigation PoC", () => {
  const project = getProject("third-sdk-navigation-app", "en");

  assert.ok(project);
  assert.equal(project.detailsAvailable, true);
  assert.equal(project.title, "HERE SDK-based Third-party Navigation PoC");
  assert.ok(project.detailSections.length > 0);
  assert.equal(project.detailSections[0]?.title, "Overview");
  assert.match(
    project.detailSections
      .flatMap((section) => section.blocks)
      .map((block) => ("text" in block ? block.text : "code" in block ? block.code : ""))
      .join("\n"),
    /TargetCameraState/
  );
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
