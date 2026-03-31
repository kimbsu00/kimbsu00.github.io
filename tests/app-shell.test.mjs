import test from "node:test";
import assert from "node:assert/strict";
import { renderHome } from "../dist-test/app.js";

test("renderHome includes locale switcher, hero copy, and featured projects", () => {
  const html = renderHome("ko");

  assert.match(html, /data-locale-switcher/);
  assert.match(html, /안드로이드 앱 개발자/);
  assert.match(html, /주요 프로젝트/);
  assert.match(html, /Mobit/);
});
