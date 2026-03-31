export const experience = [
  {
    period: "2024.09 ~ 재직중",
    locales: {
      ko: {
        company: "현대오토에버",
        role: "Connect-S/L 플랫폼 내비게이션 Controller 지도 표시 모듈 개발",
        summary:
          "Google Automotive SDK를 활용한 Android(Kotlin) 기반 내비게이션 Controller 지도 표시 모듈을 개발하고 있습니다.",
        highlights: [
          "지도 Vector Tile 데이터 요청 구조 설계 및 개발",
          "지도 표시 모듈 Coroutine 관리 구조 설계 및 개발",
          "렌더링 SDK 연동을 위한 EventQueue 및 JNI 작업",
          "신규 기능 개발과 버그 수정, 단위 테스트 작성"
        ]
      },
      en: {
        company: "Hyundai AutoEver",
        role: "Map display module development for the Connect-S/L navigation controller",
        summary:
          "Building the map display layer of an Android navigation controller with Google Automotive SDK for upcoming Hyundai Motor Group vehicles.",
        highlights: [
          "Designed and implemented Vector Tile request flows",
          "Built coroutine management for the map display module",
          "Implemented EventQueue and JNI integration for the rendering SDK",
          "Handled new features, bug fixes, and unit-test coverage"
        ]
      }
    }
  },
  {
    period: "2022.01 ~ 2023.02",
    locales: {
      ko: {
        company: "다이닝코드",
        role: "다이닝코드 안드로이드 개발자",
        summary:
          "빅데이터 기반 맛집 추천 및 검색 서비스를 제공하는 다이닝코드의 안드로이드 앱 기능 개발과 유지보수를 담당했습니다.",
        highlights: [
          "자동완성, 통합검색, 추천 기능 등 신규 기능 개발",
          "맛집 평가 및 체크인 화면 리팩터링",
          "Kotlin 전환과 안정성 개선",
          "Firebase Crashlytics 기준 최대 안정성 99.8% 기록"
        ]
      },
      en: {
        company: "DiningCode",
        role: "Android Developer",
        summary:
          "Worked on feature delivery, refactoring, and reliability improvements for the DiningCode Android app for restaurant recommendation and search.",
        highlights: [
          "Built autocomplete, integrated search, and recommendation features",
          "Refactored review and check-in flows",
          "Migrated a large Java codebase toward Kotlin",
          "Improved stability up to 99.8% in Firebase Crashlytics"
        ]
      }
    }
  }
] as const;
