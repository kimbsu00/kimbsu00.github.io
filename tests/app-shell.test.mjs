import test from "node:test";
import assert from "node:assert/strict";
import { renderHome } from "../dist-test/app.js";

test("renderHome includes locale switcher, hero copy, and featured projects", () => {
  const html = renderHome("ko");

  assert.match(html, /data-locale-switcher/);
  assert.match(html, /section-label/);
  assert.match(html, /hero-notes/);
  assert.match(html, /Software Engineer/);
  assert.match(html, /본 페이지는 한국어로 작성된 포트폴리오/);
  assert.match(html, /주요 프로젝트/);
  assert.match(html, /경력/);
  assert.match(html, /연락처/);
  assert.match(html, /Connect-S\/L 플랫폼 내비게이션 앱 개발/);
  assert.match(html, /3rd SDK 내비게이션 앱 개발/);
  assert.match(html, /다이닝코드 안드로이드 앱 개발/);
  assert.match(html, /PAD-AI/);
  assert.doesNotMatch(html, /Mobit/);
  assert.doesNotMatch(html, /프로젝트 아카이브/);
});
