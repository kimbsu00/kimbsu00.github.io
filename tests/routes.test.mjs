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
  assert.deepEqual(getProject("mobit", "en"), {
    slug: "mobit",
    featured: true,
    locale: "en",
    title: "Mobit",
    summary: "A cryptocurrency paper-trading app"
  });
});
