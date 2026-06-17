import test from "node:test";
import assert from "node:assert/strict";
import { renderProjectDetail } from "../dist-test/components/project-detail.js";
import { getProject } from "../dist-test/lib/content.js";

test("project detail renders headings, images, and link blocks", () => {
  let html;
  assert.doesNotThrow(() => {
    html = renderProjectDetail({
      locale: "ko",
      title: "PAD-AI",
      summary: "검사 데이터를 수집하고 업로드하는 Android 태블릿 앱입니다.",
      detailsAvailable: true,
      organization: "개인",
      period: "2023.03 - 2023.12",
      detailSections: [
        {
          title: "프로젝트 배경",
          blocks: [
            {
              type: "paragraph",
              text: "국내 파킨슨병과 치매 유병률은 꾸준히 증가하고 있습니다."
            },
            {
              type: "image-row",
              images: [
                {
                  src: "/assets/projects/pad-ai/01.png",
                  alt: "파킨슨병 및 치매 통계 자료 첫 번째 그래프"
                },
                {
                  src: "/assets/projects/pad-ai/02.png",
                  alt: "파킨슨병 및 치매 통계 자료 두 번째 그래프"
                }
              ]
            }
          ]
        },
        {
          title: "관련 링크",
          blocks: [
            {
              type: "link-list",
              links: [
                { label: "시연 영상 1", href: "https://youtu.be/1A3JvZItilU" },
                { label: "시연 영상 2", href: "https://youtu.be/KgQlfEHLY94" }
              ]
            }
          ]
        }
      ]
    });
  });

  assert.match(html, /프로젝트 배경/);
  assert.match(html, /관련 링크/);
  assert.match(html, /assets\/projects\/pad-ai\/01\.png/);
  assert.match(html, /assets\/projects\/pad-ai\/02\.png/);
  assert.match(html, /시연 영상 1/);
  assert.match(html, /https:\/\/youtu\.be\/1A3JvZItilU/);
  assert.match(html, /시연 영상 2/);
  assert.match(html, /https:\/\/youtu\.be\/KgQlfEHLY94/);
});

test("project detail renders a single-image section and a divider block", () => {
  let html;
  assert.doesNotThrow(() => {
    html = renderProjectDetail({
      locale: "ko",
      title: "Connect-S/L 플랫폼 내비게이션 앱 개발",
      summary: "차량용 OEM 내비게이션 앱 개발 프로젝트입니다.",
      detailsAvailable: true,
      organization: "현대오토에버",
      period: "2024.09 - 2025.09",
      detailSections: [
        {
          title: "배경",
          blocks: [
            {
              type: "image",
              image: {
                src: "/assets/projects/connect-s-l-navigation-app/01-google-maps-vector-tile-example.png",
                alt: "Google Maps Vector Tile Example"
              }
            },
            { type: "divider" }
          ]
        }
      ]
    });
  });

  assert.match(
    html,
    /connect-s-l-navigation-app\/01-google-maps-vector-tile-example\.png/
  );
  assert.match(html, /project-divider/);
});

test("project detail renders authored sections without synthetic stack or highlights sections", () => {
  const html = renderProjectDetail({
    locale: "ko",
    title: "PAD-AI",
    summary: "검사 데이터를 수집하고 업로드하는 Android 태블릿 앱입니다.",
    detailsAvailable: true,
    organization: "개인",
    period: "2023.03 - 2023.12",
    detailSections: [
      {
        title: "기술 스택",
        blocks: [{ type: "bullet-list", items: ["Android", "Kotlin"] }]
      },
      {
        title: "주요 성과",
        blocks: [{ type: "bullet-list", items: ["필드 테스트 기반 UX 개선"] }]
      }
    ]
  });

  assert.equal((html.match(/<h2>기술 스택<\/h2>/g) ?? []).length, 1);
  assert.equal((html.match(/<h2>주요 성과<\/h2>/g) ?? []).length, 1);
  assert.doesNotMatch(html, /<h2>핵심 포인트<\/h2>/);
});

test("project detail renders markdown-style inline code spans", () => {
  const html = renderProjectDetail({
    locale: "ko",
    title: "Inline Code Test",
    summary: "`SummaryCode`를 포함합니다.",
    detailsAvailable: true,
    organization: "개인",
    period: "2026",
    detailSections: [
      {
        title: "`HandlerThread` 적용",
        blocks: [
          {
            type: "paragraph",
            text: "`HandlerThread` 기반의 요청 큐를 도입했습니다."
          },
          {
            type: "bullet-list",
            items: ["`EventQueue`에 추가", "`70%` 성능 개선"]
          }
        ]
      }
    ]
  });

  assert.match(html, /<code>SummaryCode<\/code>/);
  assert.match(html, /<h2><code>HandlerThread<\/code> 적용<\/h2>/);
  assert.match(html, /<p><code>HandlerThread<\/code> 기반의 요청 큐를 도입했습니다\.<\/p>/);
  assert.match(html, /<li><code>EventQueue<\/code>에 추가<\/li>/);
  assert.match(html, /<li><code>70%<\/code> 성능 개선<\/li>/);
  assert.doesNotMatch(html, /`HandlerThread`/);
});

test("project detail renders the english fallback note without abridged detail sections", () => {
  const html = renderProjectDetail({
    locale: "en",
    title: "PAD-AI",
    summary: "An Android tablet app for collecting diagnostic task data.",
    detailsAvailable: false,
    organization: "Personal",
    period: "2023.03 - 2023.12",
    detailSections: []
  });

  assert.match(html, /Available in Korean only/);
  assert.doesNotMatch(html, /<h2>/);
  assert.match(html, /Back to overview/);
});

test("connect detail section headings preserve the top-level numbering order", () => {
  const project = getProject("connect-s-l-navigation-app", "ko");

  assert.ok(project);

  const html = renderProjectDetail(project);

  assert.doesNotMatch(html, /1\. Tile 데이터 로드 작업 최적화 - 문제/);
  assert.doesNotMatch(html, /2\. 렌더링 파이프라인 설계 및 최적화 - 배경/);
  assert.match(html, /<h2>1\. Tile 데이터 로드 작업 최적화<\/h2>/);
  assert.match(html, /<h2>2\. 렌더링 파이프라인 설계 및 최적화<\/h2>/);
  assert.match(html, /<h2>3\. 네이티브 렌더링 SDK Kotlin 환경 통합<\/h2>/);
});
