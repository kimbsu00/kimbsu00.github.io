type ProjectMediaImage = {
  src: string;
  alt: string;
  caption?: string;
};

type ProjectDetailLink = {
  label: string;
  href: string;
};

type ProjectDetailBlock =
  | { type: "paragraph"; text: string }
  | { type: "bullet-list"; items: string[] }
  | { type: "image"; image: ProjectMediaImage }
  | { type: "image-row"; images: ProjectMediaImage[] }
  | { type: "link-list"; links: ProjectDetailLink[] }
  | { type: "divider" };

type ProjectDetailSection = {
  title: string;
  blocks: ProjectDetailBlock[];
};

export const projects = [
  {
    slug: "connect-s-l-navigation-app",
    featured: true,
    locales: {
      ko: {
        title: "Connect-S/L 플랫폼 내비게이션 앱 개발",
        cardSummary: "2026년도 양산 차량용 OEM 내비게이션 앱 개발 프로젝트",
        detailSummary:
          "현대자동차 2026년도 양산 차량용 OEM 내비게이션 앱 개발 프로젝트로, 지도 표시 모듈 성능 최적화와 렌더링 구조 설계에 집중했습니다.",
        detailsAvailable: true,
        organization: "현대오토에버",
        period: "2024.09 - 2025.09",
        stack: ["Kotlin", "Android", "Google Automotive SDK", "JNI"],
        highlights: [
          "Tile 요청 callback 처리 시간 약 60% 개선",
          "프레임 단위 일관성을 보장하는 렌더링 파이프라인 설계",
          "네이티브 렌더링 SDK의 Kotlin 중심 통합"
        ],
        detailSections: [
          {
            title: "개요",
            blocks: [
              {
                type: "paragraph",
                text: "현대자동차가 2026년도에 양산 예정인 차량용 OEM 내비게이션 앱 개발 프로젝트입니다. Connect-S/L 플랫폼은 현대자동차 그룹에서 생산하는 차량 중, 제네시스 및 특수 목적 차량을 제외한 대부분의 차량을 의미합니다."
              }
            ]
          },
          {
            title: "담당 업무",
            blocks: [
              {
                type: "bullet-list",
                items: [
                  "Connect-S/L 플랫폼 북미 지역 내비게이션 지도 표시 모듈 개발",
                  "Google Automotive SDK를 활용한 내비게이션 개발",
                  "Vector Tile 데이터 로드 작업 최적화 → 프레임 성능 60% 개선",
                  "네이티브 렌더링 SDK를 Kotlin 환경에 통합",
                  "렌더링 파이프라인 설계 및 최적화"
                ]
              }
            ]
          },
          {
            title: "기술 스택",
            blocks: [
              {
                type: "bullet-list",
                items: ["Kotlin", "Android", "Google Automotive SDK", "JNI"]
              }
            ]
          },
          {
            title: "주요 성과",
            blocks: [
              {
                type: "bullet-list",
                items: [
                  "Tile 데이터 로드 경로를 재설계하여 Tile 요청 callback 처리 시간 약 60% 개선",
                  "지도 상태 변경 API를 프레임 단위로 묶어 처리하는 렌더링 파이프라인 설계",
                  "네이티브 렌더링 SDK를 Kotlin 중심 구조에 통합해 유지보수 부담 감소"
                ]
              },
              { type: "divider" }
            ]
          },
          {
            title: "1. Tile 데이터 로드 작업 최적화",
            blocks: [
              {
                type: "image",
                image: {
                  src: "/assets/projects/connect-s-l-navigation-app/01-google-maps-vector-tile-example.png",
                  alt: "Google Maps Vector Tile Example"
                }
              },
              {
                type: "paragraph",
                text: "지도는 여러 개의 Tile 데이터로 구성되며, 사용자가 지도를 이동하거나 확대/축소할 때 필요한 Tile을 지속적으로 로드해야 합니다."
              },
              {
                type: "paragraph",
                text: "프로젝트 초기에는 Tile 데이터 1개를 로드하는 데 약 10ms가 소요되었고, 이 비용이 렌더링 구간과 겹치면서 프레임 저하가 발생했습니다."
              }
            ]
          },
          {
            title: "문제",
            blocks: [
              {
                type: "paragraph",
                text: "초기 구현에서는 Tile 요청마다 coroutine을 새로 생성해 백그라운드 작업으로 넘기는 방식을 사용했습니다."
              },
              {
                type: "paragraph",
                text: "Tile 요청은 렌더링 SDK가 전달하는 callback에서 발생하며, 이 callback은 렌더링 스레드에서 호출됩니다. 렌더링 스레드에서 직접 네트워크 또는 데이터 로드 작업을 수행할 수 없기 때문에 백그라운드 처리 자체는 필요했습니다."
              },
              {
                type: "paragraph",
                text: "다만 요청마다 coroutine을 생성하는 방식은 스케줄링 비용이 반복적으로 발생했고, Tile 요청 빈도가 높은 상황에서 렌더링 스레드의 CPU 점유를 안정적으로 유지하기 어려웠습니다."
              }
            ]
          },
          {
            title: "제약",
            blocks: [
              {
                type: "bullet-list",
                items: [
                  "Tile 요청은 렌더링 흐름 중 매우 자주 발생한다.",
                  "렌더링 스레드에서 직접 데이터 로드를 수행할 수 없다.",
                  "Tile 수 자체를 줄일 수는 없으므로, 요청 처리 경로의 오버헤드를 줄여야 한다."
                ]
              }
            ]
          },
          {
            title: "해결",
            blocks: [
              {
                type: "paragraph",
                text: "\"Tile 요청마다 작업 단위를 새로 생성하는 구조\"를 없애고, 전용 워커 스레드에서 요청을 직렬화해 처리하는 방향으로 접근했습니다. 이를 위해 `HandlerThread` 기반의 요청 큐를 도입했습니다."
              },
              {
                type: "paragraph",
                text: "렌더링 스레드는 Tile 요청이 필요할 때 데이터를 큐에 넣기만 하고, 실제 처리 책임은 `TileRequestHandlerThread`가 맡도록 분리했습니다."
              },
              {
                type: "paragraph",
                text: "이 방식으로 요청마다 coroutine을 생성하는 비용을 제거하고, Tile 로드 작업을 전용 워커 스레드에서 예측 가능하게 처리할 수 있었습니다."
              }
            ]
          },
          {
            title: "결과",
            blocks: [
              {
                type: "paragraph",
                text: "Tile 요청 경로의 스케줄링 오버헤드를 줄인 결과, Tile 요청 callback의 시작 시점부터 종료 시점까지의 처리 시간이 약 60% 개선되었습니다."
              },
              {
                type: "paragraph",
                text: "즉, 렌더링 SDK가 Tile 요청 callback을 호출한 뒤 해당 callback이 반환될 때까지의 elapsed time을 기준으로 성능 개선을 확인했습니다. 결과적으로 지도 이동이 잦은 구간에서도 렌더링 흐름을 더 안정적으로 유지할 수 있었습니다."
              }
            ]
          },
          {
            title: "2. 렌더링 파이프라인 설계 및 최적화",
            blocks: [
              {
                type: "paragraph",
                text: "네이티브 렌더링 SDK는 지도 중심 좌표 변경, 축척 변경과 같은 저수준 API만 제공합니다."
              },
              {
                type: "paragraph",
                text: "예를 들어 \"현위치로 이동\" 기능을 구현하려면 지도 중심 좌표를 현위치로 변경하고 지도 축척을 기본 축척으로 변경하는 두 동작을 함께 수행해야 합니다."
              }
            ]
          },
          {
            title: "문제",
            blocks: [
              {
                type: "paragraph",
                text: "두 API가 반드시 같은 프레임에서 처리되어야 자연스러운 화면 전환이 가능합니다. 하지만 실제로는 간헐적으로 첫 번째 API가 반영된 프레임이 먼저 그려지고, 두 번째 API가 다음 프레임에서 반영되는 문제가 있었습니다."
              },
              {
                type: "paragraph",
                text: "그 결과 사용자는 먼저 지도의 중심 좌표만 이동한 뒤 한 프레임 뒤에 축척이 다시 변경되는, 끊겨 보이는 동작을 보게 되었습니다."
              }
            ]
          },
          {
            title: "제약",
            blocks: [
              {
                type: "bullet-list",
                items: [
                  "렌더링 SDK API는 반드시 렌더링 스레드에서 호출해야 한다.",
                  "대부분의 호출 지점은 렌더링 스레드 밖에 있다.",
                  "여러 API 호출을 동일 프레임 안에서 원자적으로 처리할 수 있어야 한다."
                ]
              }
            ]
          },
          {
            title: "기존 방식의 한계",
            blocks: [
              {
                type: "paragraph",
                text: "초기에는 렌더링 API 호출을 각각 lambda로 감싸 `EventQueue`에 넣고, 렌더링 스레드가 프레임을 그리기 전에 이를 순차 실행하는 구조였습니다."
              },
              {
                type: "bullet-list",
                items: [
                  "호출부에서 API 실행 로직을 lambda로 래핑해 `EventQueue`에 추가",
                  "렌더링 스레드가 프레임 직전에 큐의 lambda를 실행"
                ]
              },
              {
                type: "paragraph",
                text: "이 방식은 호출 순서는 유지할 수 있었지만, 서로 연관된 여러 API가 \"같은 프레임의 하나의 작업 단위\"로 묶여 있지는 않았습니다. 그 결과 큐 삽입 시점과 프레임 경계가 엇갈리면, 같은 사용자 동작에 속한 API들이 서로 다른 프레임에 나뉘어 처리될 수 있었습니다."
              }
            ]
          },
          {
            title: "해결",
            blocks: [
              {
                type: "paragraph",
                text: "여러 렌더링 명령을 하나의 체인으로 구성한 뒤, 최종적으로 하나의 이벤트로 큐에 넣는 방식을 도입했습니다."
              },
              {
                type: "paragraph",
                text: "이 구조를 렌더링 명령 API에 적용해 여러 동작을 하나의 작업 단위로 만들 수 있도록 했고, `pushEvent()` 시점에 하나의 이벤트로 `EventQueue`에 등록되도록 구성했습니다."
              },
              {
                type: "paragraph",
                text: "이를 통해 중심 좌표 변경과 축척 변경처럼 함께 처리되어야 하는 명령을 동일 프레임 내에서 일관되게 실행할 수 있었습니다."
              }
            ]
          },
          {
            title: "결과",
            blocks: [
              {
                type: "paragraph",
                text: "지도 상태 변경 API가 서로 다른 프레임에 나뉘어 적용되는 문제를 제거했습니다."
              },
              {
                type: "paragraph",
                text: "그 결과 현위치 복귀와 같은 상위 기능이 단일 동작처럼 자연스럽게 보이도록 만들었고, 사용자가 체감하는 지도 이동 품질을 개선할 수 있었습니다."
              }
            ]
          },
          {
            title: "3. 네이티브 렌더링 SDK Kotlin 환경 통합",
            blocks: [
              {
                type: "paragraph",
                text: "프로젝트의 렌더링 엔진은 네이티브 SDK로 제공되었기 때문에, Android 애플리케이션에서 이를 활용하려면 JNI 계층이 필요했습니다."
              }
            ]
          },
          {
            title: "설계 원칙",
            blocks: [
              {
                type: "paragraph",
                text: "JNI 계층에는 비즈니스 로직을 두지 않고, 네이티브 SDK 인터페이스와 1:1로 대응되는 Kotlin 인터페이스를 만드는 방식으로 통합했습니다."
              },
              {
                type: "paragraph",
                text: "이렇게 한 이유는 유지보수 비용을 Kotlin 레이어에 집중시키기 위해서입니다. JNI 계층에 정책이나 기능 로직이 들어가면, 이후 수정 작업마다 Kotlin과 C/C++ 양쪽의 맥락을 모두 이해해야 하기 때문입니다."
              }
            ]
          },
          {
            title: "적용 방식",
            blocks: [
              {
                type: "paragraph",
                text: "구조는 UI / Application Logic → Kotlin Rendering Facade → JNI Bridge (translation only) → Native Rendering SDK로 분리했습니다."
              },
              {
                type: "paragraph",
                text: "예를 들어 Kotlin 레이어에서는 `MapRenderer` 인터페이스를 제공하고, JNI 레이어는 이를 네이티브 함수 호출로 단순 전달하는 역할만 담당하도록 설계했습니다."
              }
            ]
          },
          {
            title: "결과",
            blocks: [
              {
                type: "bullet-list",
                items: [
                  "비즈니스 로직과 플랫폼 연동 계층의 경계를 명확히 분리",
                  "렌더링 정책 변경 시 Kotlin 레이어 중심으로 수정 가능",
                  "JNI 계층을 번역 계층으로 제한해 유지보수 난이도 감소"
                ]
              },
              { type: "divider" }
            ]
          },
          {
            title: "정리",
            blocks: [
              {
                type: "paragraph",
                text: "이 프로젝트에서는 단순 기능 개발보다도, 차량용 내비게이션 환경에서 안정적인 렌더링 품질을 확보하기 위한 구조 설계와 성능 최적화에 집중했습니다."
              },
              {
                type: "bullet-list",
                items: [
                  "Tile 요청 callback 처리 시간 최적화",
                  "프레임 단위 일관성을 보장하는 렌더링 명령 처리 구조 설계",
                  "네이티브 SDK를 Kotlin 중심 구조에 통합해 유지보수성 확보"
                ]
              },
              {
                type: "paragraph",
                text: "결과적으로 지도 표시 성능과 사용자 체감 품질을 함께 개선할 수 있었고, 이후 기능 확장에도 대응하기 쉬운 구조를 마련했습니다."
              }
            ]
          }
        ] satisfies ProjectDetailSection[]
      },
      en: {
        title: "Connect-S/L Navigation App Development",
        cardSummary: "OEM navigation app development for 2026 production vehicles.",
        detailSummary:
          "Worked on the map display module of an OEM navigation app, with emphasis on rendering performance and a maintainable Kotlin-facing architecture.",
        detailsAvailable: false,
        organization: "Hyundai AutoEver",
        period: "2024.09 - 2025.09",
        stack: ["Kotlin", "Android", "Google Automotive SDK", "JNI"],
        highlights: [
          "Improved tile callback handling time by roughly 60%",
          "Designed frame-consistent rendering command flow",
          "Integrated a native rendering SDK into a Kotlin-centric structure"
        ],
        detailSections: [] satisfies ProjectDetailSection[]
      }
    }
  },
  {
    slug: "third-sdk-navigation-app",
    featured: true,
    locales: {
      ko: {
        title: "3rd SDK 내비게이션 앱 개발",
        cardSummary: "HERE SDK를 활용한 내비게이션 앱 개발 PoC 프로젝트",
        detailSummary:
          "HERE SDK를 활용해 3rd-party navigation SDK 기반 앱 개발 가능성을 검증하는 PoC 프로젝트입니다.",
        detailsAvailable: true,
        organization: "현대오토에버",
        period: "2026.03 - 진행중",
        stack: ["Kotlin", "Android", "HERE SDK"],
        highlights: [
          "HERE SDK 기반 내비게이션 개발",
          "지도 표시 모듈 개발 리딩",
          "지도 표시 모듈 maven 배포 환경 구축"
        ],
        detailSections: [
          {
            title: "개요",
            blocks: [
              {
                type: "paragraph",
                text: "현대오토에버 자체 내비게이션 엔진이 아닌, 타 회사의 내비게이션 SDK(Mapbox, HERE, etc)를 사용하여 내비게이션 앱을 개발하는 프로젝트입니다."
              },
              {
                type: "paragraph",
                text: "본 프로젝트에서 HERE SDK를 사용하여 내비게이션 앱을 개발하는 PoC 프로젝트를 진행하고 있습니다."
              }
            ]
          },
          {
            title: "담당 업무",
            blocks: [
              {
                type: "bullet-list",
                items: [
                  "HERE SDK를 활용한 내비게이션 개발",
                  "지도 표시 모듈 개발 리딩",
                  "지도 표시 모듈 maven 배포 환경 구축"
                ]
              }
            ]
          },
          {
            title: "기술 스택",
            blocks: [
              {
                type: "bullet-list",
                items: ["Kotlin", "Android", "HERE SDK", "ClaudeCode"]
              }
            ]
          }
        ] satisfies ProjectDetailSection[]
      },
      en: {
        title: "3rd SDK Navigation App Development",
        cardSummary: "A navigation proof of concept built with HERE SDK.",
        detailSummary:
          "A proof-of-concept project exploring navigation app development on top of HERE SDK.",
        detailsAvailable: false,
        organization: "Hyundai AutoEver",
        period: "2026.03 - Present",
        stack: ["Kotlin", "Android", "HERE SDK"],
        highlights: [
          "Navigation development with HERE SDK",
          "Leading the map display module",
          "Setting up Maven distribution for the map display module"
        ],
        detailSections: [] satisfies ProjectDetailSection[]
      }
    }
  },
  {
    slug: "diningcode-android-app",
    featured: true,
    locales: {
      ko: {
        title: "다이닝코드 안드로이드 앱 개발",
        cardSummary:
          "검색, 추천, 평가/체크인, 프로파일/지도 기능을 개선한 Android 앱 개발 이력",
        detailSummary:
          "다이닝코드 Android 앱의 핵심 사용자 경험을 개선하며 검색, 추천, 평가, 지도, 안정성 영역을 폭넓게 다룬 작업입니다.",
        detailsAvailable: true,
        organization: "다이닝코드",
        period: "2022.01 - 2023.02",
        stack: [
          "Android",
          "Kotlin",
          "Java",
          "XML",
          "MVVM",
          "ViewModel",
          "LiveData",
          "Coroutine",
          "Glide",
          "Naver Map"
        ],
        highlights: [
          "통합검색과 자동완성 구조 설계",
          "레거시 Java/MVC 화면의 Kotlin/MVVM 전환",
          "운영 서비스 안정성 및 UX 개선"
        ],
        detailSections: [
          {
            title: "개요",
            blocks: [
              {
                type: "paragraph",
                text: "다이닝코드에서 Android 앱 기능 개발과 화면 개선 작업을 진행했습니다."
              },
              {
                type: "paragraph",
                text: "제가 참여한 작업은 검색, 추천, 평가/체크인, 프로파일/지도, 커뮤니티 안전 기능까지 폭넓게 분포했으며, 서비스 운영 중 실제 사용자 경험을 개선하는 방향의 프로젝트가 대부분이었습니다."
              }
            ]
          },
          {
            title: "기술 스택",
            blocks: [
              {
                type: "bullet-list",
                items: [
                  "Android",
                  "Kotlin",
                  "Java",
                  "XML",
                  "MVC",
                  "MVVM",
                  "AAC",
                  "ViewModel",
                  "LiveData",
                  "ViewBinding",
                  "Coroutine",
                  "Handler",
                  "MessageQueue",
                  "Glide",
                  "DeepLink",
                  "AppLink"
                ]
              },
              {
                type: "paragraph",
                text: "프로젝트에 따라 아래 기술도 사용했습니다."
              },
              {
                type: "bullet-list",
                items: ["Google ML Kit", "Naver Map", "Google AdMob"]
              }
            ]
          },
          {
            title: "핵심 기여",
            blocks: [
              {
                type: "bullet-list",
                items: [
                  "다이닝코드의 핵심 기능인 검색 경험을 개선하며, 통합검색과 자동완성 구조를 안정적으로 설계했습니다.",
                  "레거시 Java/MVC 기반 화면을 Kotlin/MVVM으로 전환하면서 유지보수성과 기능 확장성을 높였습니다.",
                  "Custom View, 이미지 처리, 중첩 스크롤 처리, 센서/지도 연동 등 Android 플랫폼 특화 문제를 직접 해결했습니다.",
                  "운영 서비스에서 실제로 발생하는 크래시, 임계 구역 문제, 디바이스 예외, 정책 대응 기능을 구현하며 안정성을 보강했습니다."
                ]
              },
              { type: "divider" }
            ]
          },
          {
            title: "1. 검색 탭 리뉴얼",
            blocks: [
              {
                type: "paragraph",
                text: "다이닝코드의 핵심 기능인 통합검색 흐름을 전면적으로 개편한 프로젝트입니다."
              },
              {
                type: "paragraph",
                text: "검색창, 통합검색, 리스트 더보기, 지도 더보기까지 이어지는 검색 경험 전체를 새 구조로 구현했습니다."
              },
              {
                type: "paragraph",
                text: "주요 작업:"
              },
              {
                type: "bullet-list",
                items: [
                  "검색창, 통합검색, 리스트 더보기, 지도 더보기 화면 구현",
                  "최근 검색어 Local DB 저장 기능 개발",
                  "검색 필터 및 거리 필터 Custom View 개발",
                  "네이버 지도 API 기반 지도 더보기 화면 개발",
                  "카카오톡 공유, DeepLink, AppLink 기능 구현"
                ]
              },
              {
                type: "paragraph",
                text: "대표 이슈:"
              },
              {
                type: "bullet-list",
                items: [
                  "검색 관련 화면에서 앱이 백그라운드 종료 후 재실행될 때 크래시가 발생했습니다.",
                  "필요한 상태를 `onSaveInstanceState`에 저장하고 `onCreate`에서 복원하도록 수정해 문제를 해결했습니다."
                ]
              },
              {
                type: "paragraph",
                text: "이 프로젝트를 통해 검색 진입부터 결과 탐색, 공유까지 이어지는 사용자 흐름을 하나의 경험으로 정리할 수 있었습니다."
              }
            ]
          },
          {
            title: "2. 통합검색 자동완성 기능 개발",
            blocks: [
              {
                type: "paragraph",
                text: "검색어 입력에 따라 자동완성 데이터를 실시간으로 보여주는 기능을 개발했습니다."
              },
              {
                type: "paragraph",
                text: "단순 UI 기능처럼 보이지만, 실제로는 입력 이벤트 빈도, 서버 부하, 응답 순서, 멀티스레드 안정성을 모두 고려해야 하는 작업이었습니다."
              },
              {
                type: "paragraph",
                text: "주요 작업:"
              },
              {
                type: "bullet-list",
                items: [
                  "자동완성 기능 멀티스레드 아키텍처 설계",
                  "서버 부하 완화를 위한 호출 주기 및 유효 검색어 조건 설계",
                  "자동완성 하이라이트 기능 구현",
                  "문자열 매칭 성능 개선"
                ]
              },
              {
                type: "paragraph",
                text: "대표 이슈:"
              },
              {
                type: "bullet-list",
                items: [
                  "먼저 보낸 요청보다 나중 요청의 응답이 더 빨리 도착해, 오래된 자동완성 결과가 최신 입력을 덮어쓰는 문제가 있었습니다.",
                  "요청마다 순번을 부여하고, 마지막 반영 순번보다 큰 응답만 화면에 반영하도록 처리해 해결했습니다."
                ]
              },
              {
                type: "paragraph",
                text: "또 다른 기술적 포인트:"
              },
              {
                type: "bullet-list",
                items: [
                  "`UI Thread`와 `Background Thread`가 같은 `ArrayDeque`에 접근하며 발생한 임계 구역 문제를 `Handler`와 `MessageQueue` 기반 단일 접근 구조로 해결했습니다.",
                  "자동완성 하이라이트의 문자열 매칭 방식을 KMP 알고리즘으로 변경해 약 `70%` 성능 개선(`111ms -> 32ms`)을 확인했습니다."
                ]
              },
              {
                type: "paragraph",
                text: "이 프로젝트는 Android 앱에서 멀티스레드 안정성과 사용자 체감 성능을 동시에 다룬 경험으로 정리할 수 있습니다."
              }
            ]
          },
          {
            title: "3. 추천 탭 개발",
            blocks: [
              {
                type: "paragraph",
                text: "기존 홈 화면 역할을 하던 `다코투데이` 탭을 새로운 `추천 탭`으로 전환한 프로젝트입니다."
              },
              {
                type: "paragraph",
                text: "추천 콘텐츠를 더 풍부하게 보여주면서도, 중첩 스크롤 환경에서 자연스러운 탐색 경험을 만드는 것이 핵심이었습니다."
              },
              {
                type: "paragraph",
                text: "주요 작업:"
              },
              {
                type: "bullet-list",
                items: [
                  "구 버전 홈 화면을 추천 탭으로 전환",
                  "`Glide` 기반 이미지 로드 및 캐싱",
                  "중첩 `RecyclerView` 구조 구현 및 스크롤 성능 개선",
                  "추천 콘텐츠 공유 기능 및 DeepLink/AppLink 구현",
                  "`BottomSheetDialogFragment` 기반 전체 화면 바텀시트 개발"
                ]
              },
              {
                type: "paragraph",
                text: "대표 이슈:"
              },
              {
                type: "bullet-list",
                items: [
                  "추천 탭은 `Vertical RecyclerView` 안에 여러 `Horizontal RecyclerView`가 들어가는 구조였기 때문에, 스크롤 방향이 사용자 의도와 다르게 소비되는 문제가 빈번했습니다.",
                  "커스텀 `RecyclerView.OnItemTouchListener`를 구현해 `deltaX`와 `deltaY`를 비교하고, 더 크게 이동한 방향의 스크롤이 이벤트를 소비하도록 만들어 해결했습니다."
                ]
              },
              {
                type: "paragraph",
                text: "또한 초기에는 카드 레이아웃이 3단 구조여서 렌더링 비용이 컸고, 이를 1단 구조로 단순화해 스크롤 성능도 함께 개선했습니다."
              }
            ]
          },
          {
            title: "4. 맛집 평가 화면 기능 개선",
            blocks: [
              {
                type: "paragraph",
                text: "맛집 평가는 다이닝코드에서 가장 중요한 사용자 생성 데이터 입력 화면입니다."
              },
              {
                type: "paragraph",
                text: "이 프로젝트에서는 화면 UX 개선과 함께, 레거시 Java/MVC 구조를 Kotlin/MVVM으로 전환하고 이미지 처리 기능까지 확장했습니다."
              },
              {
                type: "paragraph",
                text: "주요 작업:"
              },
              {
                type: "bullet-list",
                items: [
                  "Java 기반 화면을 Kotlin으로 전환",
                  "MVC 구조를 MVVM으로 리팩토링",
                  "`Scoped Storage` 대응 Custom Gallery 개발",
                  "이미지 업로드 전 전처리(Bitmap resizing, Exif 로드) 기능 구현",
                  "`Google ML Kit` 기반 얼굴 인식 기능 개발",
                  "`Fastest Gaussian Blur` 기반 얼굴 블러 기능 개발",
                  "`CustomRatingBar` 등 커스텀 입력 UI 개발"
                ]
              },
              {
                type: "paragraph",
                text: "대표 이슈:"
              },
              {
                type: "bullet-list",
                items: [
                  "Android 10부터 적용된 `Scoped Storage` 정책으로 인해 이미지 접근 방식을 버전별로 분기해야 했습니다.",
                  "Android 10 이상에서는 `Content URI`, 미만에서는 파일 경로 기반으로 접근하도록 구현해 대응했습니다."
                ]
              },
              {
                type: "paragraph",
                text: "추가 성과:"
              },
              {
                type: "bullet-list",
                items: [
                  "기본 `RatingBar`의 간격/해상도 문제를 해결하기 위해 `CustomRatingBar`를 직접 구현했습니다.",
                  "4K(`4000x2252`) 이미지에 대해 얼굴 블러 처리 시간을 `1000ms` 미만으로 유지했습니다."
                ]
              },
              {
                type: "paragraph",
                text: "이 프로젝트는 입력 UI, 이미지 처리, 플랫폼 정책 대응, 구조 리팩토링이 동시에 들어간 대표 사례였습니다."
              }
            ]
          },
          {
            title: "5. 맛집 프로파일 및 프로파일 지도 화면 개선",
            blocks: [
              {
                type: "paragraph",
                text: "맛집 프로파일 화면과 프로파일 지도 화면을 함께 개선한 프로젝트입니다."
              },
              {
                type: "paragraph",
                text: "프로파일 UI를 손보고, 지도 화면을 Google Map에서 Naver Map으로 전환하면서 도보/내비게이션 기능도 함께 정비했습니다."
              },
              {
                type: "paragraph",
                text: "주요 작업:"
              },
              {
                type: "bullet-list",
                items: [
                  "맛집 프로파일 화면 UI 개선",
                  "`Google AdMob` 광고 추가",
                  "지도 화면의 Google Map -> Naver Map 전환",
                  "네이버지도, 티맵, 카카오맵 기반 내비게이션 연동",
                  "도보 기능 개발",
                  "디바이스 위치와 사용자 마커 위치 동기화",
                  "자이로 센서 기반 지도 Pivot 기능 구현"
                ]
              },
              {
                type: "paragraph",
                text: "대표 이슈:"
              },
              {
                type: "bullet-list",
                items: [
                  "자이로 센서가 없는 기기에서 도보 기능 실행 시 앱이 강제 종료되는 문제가 있었습니다.",
                  "`SensorManager.getDefaultSensor(Sensor.TYPE_ROTATION_VECTOR)` 결과를 확인해, 센서가 있는 경우에만 기능을 활성화하도록 수정해 해결했습니다."
                ]
              },
              {
                type: "paragraph",
                text: "이 프로젝트는 지도 SDK 전환, 외부 앱 연동, 센서 기반 기능, 디바이스 예외 처리까지 포함된 Android 플랫폼 중심 작업이었습니다."
              },
              { type: "divider" }
            ]
          },
          {
            title: "정리",
            blocks: [
              {
                type: "paragraph",
                text: "다이닝코드에서의 경험은 단순히 화면을 많이 만든 경험이라기보다, 운영 중인 Android 서비스에서 핵심 사용자 경험을 개선하고 레거시 구조를 정리하며 플랫폼 특화 문제를 해결한 경험으로 정리할 수 있습니다."
              },
              {
                type: "paragraph",
                text: "특히 검색, 추천, 평가, 지도처럼 성격이 다른 기능들을 맡으면서도 공통적으로 다음 문제를 해결해 왔습니다."
              },
              {
                type: "bullet-list",
                items: [
                  "복잡한 화면 흐름을 사용자 관점에서 더 자연스럽게 만드는 일",
                  "멀티스레드, 상태 복원, 디바이스 예외 같은 안정성 문제를 줄이는 일",
                  "레거시 코드를 Kotlin/MVVM 기반 구조로 정리해 유지보수 가능성을 높이는 일"
                ]
              },
              {
                type: "paragraph",
                text: "이 경험은 제가 Android 앱에서 기능 구현뿐 아니라, 구조와 안정성까지 함께 책임지는 엔지니어로 일해왔다는 점을 보여준다고 생각합니다."
              }
            ]
          }
        ] satisfies ProjectDetailSection[]
      },
      en: {
        title: "DiningCode Android App Development",
        cardSummary:
          "Android product work across search, recommendations, reviews, maps, and reliability.",
        detailSummary:
          "Worked on major user-facing Android flows at DiningCode, from search and recommendations to reviews, maps, and platform-specific reliability issues.",
        detailsAvailable: false,
        organization: "DiningCode",
        period: "2022.01 - 2023.02",
        stack: [
          "Android",
          "Kotlin",
          "Java",
          "XML",
          "MVVM",
          "ViewModel",
          "LiveData",
          "Coroutine",
          "Glide",
          "Naver Map"
        ],
        highlights: [
          "Integrated search and autocomplete architecture",
          "Java/MVC to Kotlin/MVVM migrations",
          "UI, map, and production stability improvements"
        ],
        detailSections: [] satisfies ProjectDetailSection[]
      }
    }
  },
  {
    slug: "pad-ai",
    featured: true,
    locales: {
      ko: {
        title: "PAD-AI",
        cardSummary:
          "파킨슨병 및 알츠하이머 조기 진단을 위한 데이터 수집용 Android 태블릿 앱",
        detailSummary:
          "그리기, 영상, 음성 태스크를 통해 검사 데이터를 수집하고 업로드하는 Android 태블릿 애플리케이션 개발을 전담했습니다.",
        detailsAvailable: true,
        organization: "개인",
        period: "2023.03 - 2023.12",
        stack: [
          "Android",
          "Kotlin",
          "Coroutine",
          "MVVM",
          "ViewModel",
          "LiveData",
          "CameraX",
          "OkHttp"
        ],
        highlights: [
          "고령층 대상 필드 테스트 기반 UX 개선",
          "CameraX 기반 영상 태스크와 손 위치 인식 구현",
          "업로드 실패 데이터 복구 흐름 구현"
        ],
        detailSections: [
          {
            title: "개요",
            blocks: [
              {
                type: "paragraph",
                text: "`PAD-AI`는 파킨슨병(PD) 및 알츠하이머병(AD)의 조기 진단을 보조하기 위해 검사 데이터를 수집하고 결과를 확인할 수 있도록 만든 Android 태블릿 애플리케이션입니다."
              },
              {
                type: "paragraph",
                text: "프로젝트 전체는 크게 세 부분으로 구성되었습니다."
              },
              {
                type: "bullet-list",
                items: [
                  "PD 및 AD 진단 모델",
                  "데이터 수집용 애플리케이션 `PAD-AI`",
                  "데이터 저장 및 업로드를 위한 스토리지 서버"
                ]
              },
              {
                type: "paragraph",
                text: "이 중 저는 데이터 수집용 Android 애플리케이션 `PAD-AI` 개발을 전담했습니다."
              },
              {
                type: "paragraph",
                text: "앱은 그리기, 영상, 음성 태스크를 통해 sensory, visual, acoustic 데이터를 수집하고, 이를 서버에 업로드한 뒤 검사 결과를 확인할 수 있도록 구성했습니다."
              }
            ]
          },
          {
            title: "담당 업무",
            blocks: [
              {
                type: "bullet-list",
                items: [
                  "데이터 수집용 Android 태블릿 애플리케이션 `PAD-AI` 개발",
                  "태스크별 화면 상태와 업로드 흐름 분리를 위한 `MVVM` 구조 적용",
                  "스타일러스 입력 기반 그리기 기능이 포함된 Custom View 개발",
                  "`CameraX` 기반 영상 녹화 기능 구현",
                  "`MediaPipe Hand Skeleton` 기반 손 위치 인식 로직 구현",
                  "음성 재생 및 녹음 기능 구현",
                  "`OkHttp` 기반 multipart 업로드 기능 구현",
                  "업로드 실패 데이터의 로컬 저장 및 재업로드 복구 처리 구현"
                ]
              }
            ]
          },
          {
            title: "기술 스택",
            blocks: [
              {
                type: "bullet-list",
                items: [
                  "Android",
                  "Kotlin",
                  "Coroutine",
                  "XML",
                  "MVVM",
                  "AAC",
                  "ViewModel",
                  "LiveData",
                  "ViewBinding",
                  "CameraX",
                  "OkHttp"
                ]
              }
            ]
          },
          {
            title: "주요 성과",
            blocks: [
              {
                type: "bullet-list",
                items: [
                  "고령층 사용자 대상 필드 테스트를 바탕으로 음성 태스크 UI/UX를 반복 개선",
                  "손 위치 인식 기반 촬영 시작 조건을 도입해 영상 태스크의 사용성과 데이터 품질 개선",
                  "JSON, PNG, MP4, WAV 파일을 안정적으로 업로드하는 데이터 수집 앱 구현",
                  "업로드 실패 데이터의 로컬 보관 및 재전송 흐름을 추가해 수집 누락 위험 완화",
                  "`2023 KU SW경진대회` 우수상 수상"
                ]
              },
              { type: "divider" }
            ]
          },
          {
            title: "프로젝트 배경",
            blocks: [
              {
                type: "paragraph",
                text: "국민건강보험공단과 중앙치매센터의 통계 자료에 따르면, 국내 파킨슨병과 치매 유병률은 꾸준히 증가하고 있습니다."
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
              },
              {
                type: "paragraph",
                text: "특히 파킨슨병은 완치보다 조기 발견과 지속적인 관리가 중요한 질환이기 때문에, 일상적인 환경에서 검사 데이터를 쉽게 수집하고 진단 보조에 활용할 수 있는 도구가 필요했습니다."
              },
              {
                type: "paragraph",
                text: "이 프로젝트는 태블릿 기반 애플리케이션을 통해 검사 과정을 단순화하고, 수집된 데이터를 AI 모델 학습 및 진단 보조에 활용할 수 있도록 만드는 것을 목표로 했습니다."
              },
              {
                type: "paragraph",
                text: "제가 맡은 `PAD-AI`는 그 목표를 위해 실제 검사 수행 인터페이스와 데이터 수집 파이프라인을 담당하는 사용자 접점이었습니다."
              },
              { type: "divider" }
            ]
          },
          {
            title: "2. 애플리케이션 구조",
            blocks: [
              {
                type: "paragraph",
                text: "`PAD-AI`는 세 가지 종류의 검사 태스크를 수행합니다."
              },
              {
                type: "bullet-list",
                items: [
                  "그리기 태스크: stylus 입력을 통해 sensory data 수집",
                  "영상 태스크: 손 움직임 영상을 통해 visual data 수집",
                  "음성 태스크: 음성 녹음 데이터를 통해 acoustic data 수집"
                ]
              },
              {
                type: "paragraph",
                text: "수집된 결과물은 아래와 같이 서버로 업로드되도록 구성했습니다."
              },
              {
                type: "bullet-list",
                items: [
                  "그리기 데이터: JSON, PNG",
                  "영상 데이터: MP4",
                  "음성 데이터: WAV"
                ]
              },
              {
                type: "paragraph",
                text: "앱 구조는 화면 상태 관리, 태스크 수행, 업로드 복구 흐름이 서로 엉키지 않도록 `MVVM` 기반으로 분리했습니다."
              },
              {
                type: "paragraph",
                text: "이 구조를 적용한 이유는 검사 화면의 UI/UX가 실제 필드 테스트 결과에 따라 자주 바뀌는 상황에서, 화면 로직과 데이터 처리 로직을 분리해 유지보수 비용을 줄이기 위해서였습니다."
              },
              { type: "divider" }
            ]
          },
          {
            title: "3-1. 스타일러스 전용 그리기 기능 구현",
            blocks: [
              {
                type: "paragraph",
                text: "그리기 태스크는 단순 드로잉 기능이 아니라, 검사 종류에 따라 서로 다른 미리보기 이미지와 입력 제약이 필요한 구조였습니다."
              },
              {
                type: "paragraph",
                text: "또한 손가락 입력이 아니라 `STYLUS_PEN` 기반 입력만 허용해야 했기 때문에, 공용 위젯이 아닌 전용 `Custom View`로 구현했습니다."
              },
              {
                type: "paragraph",
                text: "주요 구현 내용은 다음과 같습니다."
              },
              {
                type: "bullet-list",
                items: [
                  "화면별 미리보기 이미지를 XML attribute로 선택 가능하도록 설계",
                  "여러 미리보기 이미지를 공통 방식으로 그리기 위해 `PadAiDrawData` 인터페이스 정의",
                  "stylus 입력의 `x`, `y`, `pressure` 값을 추출해 시계열 JSON 데이터 생성"
                ]
              },
              {
                type: "paragraph",
                text: "이 구조를 통해 검사 유형이 늘어나더라도 View 자체를 다시 만들지 않고, 미리보기 데이터와 속성만 바꿔 확장할 수 있도록 했습니다."
              }
            ]
          },
          {
            title: "3-2. 음성 재생 및 녹음 기능 구현",
            blocks: [
              {
                type: "paragraph",
                text: "음성 태스크에서는 검사 안내 음성을 재생하고, 사용자 응답을 녹음해야 했습니다."
              },
              {
                type: "paragraph",
                text: "이를 위해 오디오 재생과 녹음을 분리해 구현했습니다."
              },
              {
                type: "bullet-list",
                items: [
                  "오디오 안내 음성 재생 기능 구현",
                  "재생 중단 시 player resource 정리 및 worker thread 종료",
                  "`AudioRecord` 기반 PCM 녹음 기능 구현",
                  "PCM 데이터를 WAV 파일로 변환한 뒤 내부 저장소에 보관"
                ]
              },
              {
                type: "paragraph",
                text: "이렇게 저장된 파일은 이후 업로드 단계에서 다른 형식의 검사 데이터와 함께 서버로 전송되도록 연결했습니다."
              }
            ]
          },
          {
            title: "3-3. 다양한 형식의 파일 업로드 및 복구 처리",
            blocks: [
              {
                type: "paragraph",
                text: "검사 한 번으로 생성되는 데이터 형식이 JSON, PNG, MP4, WAV 등으로 다양했기 때문에, `OkHttp` 기반 `multipart/form-data` 업로드 기능을 구현했습니다."
              },
              {
                type: "paragraph",
                text: "또한 현장 사용 환경에서는 네트워크가 항상 안정적이지 않기 때문에, 업로드 실패를 정상 흐름 안에서 처리할 필요가 있었습니다. 이를 위해 다음과 같은 복구 로직을 추가했습니다."
              },
              {
                type: "bullet-list",
                items: [
                  "업로드 실패 시 데이터를 내부 저장소 `File Directory`에 보관",
                  "앱 재실행 시 실패 데이터 존재 여부를 확인",
                  "사용자가 재업로드를 선택하면 업로드를 재개"
                ]
              },
              {
                type: "paragraph",
                text: "이 기능을 통해 현장 검사 도중 네트워크 문제로 수집 데이터가 유실되는 위험을 줄일 수 있었습니다."
              },
              {
                type: "paragraph",
                text: "개인 식별 정보는 직접 저장하지 않고, 각 검사 대상을 `UUID` 기반 식별자로 관리하도록 처리했습니다."
              },
              { type: "divider" }
            ]
          },
          {
            title: "이슈 1 - 음성 태스크 UI/UX 개선",
            blocks: [
              {
                type: "paragraph",
                text: "이 프로젝트는 고령층 사용자가 실제로 검사를 수행할 수 있어야 의미가 있는 서비스였습니다."
              },
              {
                type: "paragraph",
                text: "그래서 실제 어르신들을 대상으로 두 차례의 필드 테스트를 진행했고, 그 결과 음성 태스크 화면이 직관적이지 않아 검사 진행이 어렵다는 피드백을 받았습니다."
              },
              {
                type: "paragraph",
                text: "문제의 핵심은 두 가지였습니다."
              },
              {
                type: "bullet-list",
                items: [
                  "화면 요소의 의미가 한눈에 이해되지 않음",
                  "검사 방법이 텍스트만으로 전달되어 오해가 발생함"
                ]
              },
              {
                type: "paragraph",
                text: "우선 음성 태스크 화면을 더 단순한 구조로 재설계해, 사용자가 다음 행동을 쉽게 이해할 수 있도록 UI를 정리했습니다."
              },
              {
                type: "paragraph",
                text: "추가로 검사 방법을 텍스트만으로 전달하지 않고, 음성 가이드를 함께 제공해 사용자가 절차를 더 쉽게 따라올 수 있도록 개선했습니다."
              },
              {
                type: "paragraph",
                text: "이후 추가 피드백에서 전자기기에 익숙하지 않은 사용자들이 아이콘의 의미를 직관적으로 이해하지 못한다는 점을 확인했고, 이를 반영해 아이콘 사용을 최소화하는 방향으로 한 차례 더 개선했습니다."
              },
              {
                type: "paragraph",
                text: "음성 태스크는 단순히 화면을 보기 좋게 바꾸는 수준이 아니라, 실제 사용자 집단의 피드백을 반영해 단계적으로 개선한 화면이 되었습니다."
              },
              {
                type: "paragraph",
                text: "그 결과 고령층 사용자가 검사 흐름을 이해하고 수행하는 데 필요한 인지 부담을 낮출 수 있었고, 음성 태스크 진행 난이도를 실질적으로 줄일 수 있었습니다."
              },
              {
                type: "image-row",
                images: [
                  {
                    src: "/assets/projects/pad-ai/03-voice-task-screen-v1.png",
                    alt: "음성 태스크 검사 화면 버전 1"
                  },
                  {
                    src: "/assets/projects/pad-ai/04-voice-task-screen-v2.png",
                    alt: "음성 태스크 검사 화면 버전 2"
                  },
                  {
                    src: "/assets/projects/pad-ai/05-voice-task-screen-v3.png",
                    alt: "음성 태스크 검사 화면 최종 버전"
                  }
                ]
              },
              { type: "divider" }
            ]
          },
          {
            title: "이슈 2 - 영상 태스크 UX 개선",
            blocks: [
              {
                type: "paragraph",
                text: "영상 태스크에서는 사용자가 손바닥을 정해진 촬영 영역 안에 위치시켜야 했습니다."
              },
              {
                type: "paragraph",
                text: "필드 테스트 결과, 전자기기에 익숙하지 않은 사용자들이 화면 속 사각형 영역에 손을 정확히 맞추는 데 어려움을 겪는다는 문제가 확인됐습니다."
              },
              {
                type: "paragraph",
                text: "이 문제는 단순 UX 문제가 아니라 데이터 품질과 직접 연결되어 있었습니다. 손이 올바른 위치에 들어오지 않으면, 수집된 영상 데이터의 일관성이 떨어지고 이후 모델 학습에도 영향을 줄 수 있기 때문입니다."
              },
              {
                type: "paragraph",
                text: "초기 방식은 사용자가 화면을 터치해 직접 촬영을 시작하는 구조였습니다. 하지만 이 방식은 \"촬영 시작\"과 \"손 위치 정렬\"이 분리되어 있었기 때문에, 사용자가 준비되지 않은 상태에서 촬영이 시작되는 문제가 있었습니다."
              },
              {
                type: "paragraph",
                text: "이 문제를 해결하기 위해 `Google MediaPipe Hand Skeleton` 인식 모델을 활용해, 손바닥이 화면 내 지정 영역에 들어온 경우에만 촬영이 시작되도록 변경했습니다."
              },
              {
                type: "paragraph",
                text: "구현 흐름은 다음과 같습니다."
              },
              {
                type: "bullet-list",
                items: [
                  "`CameraX`의 `ImageAnalysis`에서 프레임을 수신",
                  "프레임 이미지를 Hand Skeleton 인식에 전달",
                  "인식된 손 좌표가 지정 영역 안에 들어오면 `isHandInRect` 상태를 갱신",
                  "View가 해당 상태를 관찰하고, 조건이 충족될 때만 영상 검사 시작"
                ]
              },
              {
                type: "paragraph",
                text: "이 구조를 통해 사용자가 직접 타이밍을 맞추는 부담을 줄이고, 시스템이 촬영 시작 조건을 판단하도록 만들었습니다."
              },
              {
                type: "paragraph",
                text: "영상 태스크는 \"사용자가 버튼을 눌러 시작하는 촬영\"에서 \"손 위치가 준비되면 자동으로 시작되는 촬영\"으로 바뀌었습니다."
              },
              {
                type: "paragraph",
                text: "그 결과 사용자가 검사 방식을 이해하기 쉬워졌고, 촬영 시작 시점의 데이터 품질도 더 일관되게 관리할 수 있었습니다."
              },
              {
                type: "image-row",
                images: [
                  {
                    src: "/assets/projects/pad-ai/06-video-task-start-screen-v1.png",
                    alt: "기존 영상 태스크 시작 화면"
                  },
                  {
                    src: "/assets/projects/pad-ai/07-video-task-before-palm-detection.png",
                    alt: "손바닥 인식 전 영상 태스크 화면"
                  },
                  {
                    src: "/assets/projects/pad-ai/08-video-task-after-palm-detection.png",
                    alt: "손바닥 인식 후 영상 태스크 화면"
                  }
                ]
              },
              { type: "divider" }
            ]
          },
          {
            title: "프로젝트 결과",
            blocks: [
              {
                type: "paragraph",
                text: "`PAD-AI`는 그리기, 영상, 음성 태스크를 통해 다양한 형식의 검사 데이터를 수집하고, 이를 서버에 업로드한 뒤 결과를 확인할 수 있는 형태로 완성되었습니다."
              },
              {
                type: "paragraph",
                text: "이 프로젝트를 통해 다음과 같은 성과를 만들 수 있었습니다."
              },
              {
                type: "bullet-list",
                items: [
                  "실제 고령층 사용자를 대상으로 한 필드 테스트 기반 UX 개선 경험 확보",
                  "모바일 입력, 카메라, 오디오, 파일 업로드를 하나의 검사 흐름으로 통합",
                  "데이터 수집 누락을 줄이기 위한 업로드 복구 흐름 구현",
                  "졸업 프로젝트 결과물로 `2023 KU SW경진대회 우수상` 수상"
                ]
              },
              {
                type: "paragraph",
                text: "이 프로젝트에서 가장 중요했던 점은 단순히 기능을 구현하는 것이 아니라, 실제 사용자가 검사 과정을 끝까지 수행할 수 있도록 앱을 설계하고 개선한 경험이었습니다."
              },
              {
                type: "paragraph",
                text: "특히 고령층 사용자 피드백을 바탕으로 UX를 반복 개선하고, 그 결과를 데이터 수집 품질과 연결해 풀어낸 점이 `PAD-AI` 프로젝트의 핵심 가치였습니다."
              },
              { type: "divider" }
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
        ] satisfies ProjectDetailSection[]
      },
      en: {
        title: "PAD-AI",
        cardSummary:
          "An Android tablet app for collecting diagnostic task data for Parkinson’s and Alzheimer’s research.",
        detailSummary:
          "Led development of the Android tablet app used to collect drawing, video, and voice task data for early-diagnosis research workflows.",
        detailsAvailable: false,
        organization: "Personal",
        period: "2023.03 - 2023.12",
        stack: [
          "Android",
          "Kotlin",
          "Coroutine",
          "MVVM",
          "ViewModel",
          "LiveData",
          "CameraX",
          "OkHttp"
        ],
        highlights: [
          "Field-test-driven UX improvements for older users",
          "Video-task flow using hand-position recognition",
          "Reliable upload and retry flow for collected assets"
        ],
        detailSections: [] satisfies ProjectDetailSection[]
      }
    }
  }
] as const;
