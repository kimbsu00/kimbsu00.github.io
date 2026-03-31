import test from "node:test";
import assert from "node:assert/strict";
import { renderProjectDetail } from "../dist-test/components/project-detail.js";

test("english project detail shows korean-only notice when deep detail is missing", () => {
  const html = renderProjectDetail({
    locale: "en",
    title: "Mobit",
    summary: "A cryptocurrency paper-trading app",
    detailsAvailable: false,
    highlights: ["Paper trading with live market data"]
  });

  assert.match(html, /Available in Korean only/);
});
