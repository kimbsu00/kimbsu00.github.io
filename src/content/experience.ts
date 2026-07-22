export const experience = [
  {
    period: "2026.07 ~ 재직중",
    locales: {
      ko: {
        company: "현대오토에버",
        role: "Android Framework 개발",
        summary:
          "AOSP 기반 차량 인포테인먼트 시스템의 Android Framework 개발 조직에서 플랫폼 기능 개발과 시스템 레벨 이슈 대응을 담당하고 있습니다.",
        highlights: [
          "AOSP WindowManagerService 기반 화면/윈도우 정책 개발",
          "차량 인포테인먼트 환경의 Android Framework 기능 개발",
          "WindowManagerService 관련 시스템 레벨 이슈 분석 및 대응"
        ]
      },
      en: {
        company: "Hyundai AutoEver",
        role: "Android Framework Development",
        summary:
          "Working on Android Framework development for AOSP-based vehicle infotainment systems, focusing on platform features and system-level issue analysis.",
        highlights: [
          "AOSP WindowManagerService-based screen and window policy development",
          "Android Framework feature development for vehicle infotainment environments",
          "System-level issue analysis and handling around WindowManagerService"
        ]
      }
    }
  },
  {
    period: "2024.09 ~ 2026.06",
    locales: {
      ko: {
        company: "현대오토에버",
        role: "차량용 내비게이션 개발",
        summary:
          "2026년도 양산 차량용 OEM 내비게이션 지도 표시 모듈 개발, XP2 플랫폼 내비게이션 엔진 마이그레이션, 3rd SDK 내비게이션 엔진 개발에 참여했습니다.",
        highlights: [
          "Connect-S/L 플랫폼 지도 표시 모듈 개발",
          "XP2 플랫폼 내비게이션 엔진 마이그레이션",
          "HERE SDK 기반 3rd SDK 내비게이션 PoC"
        ]
      },
      en: {
        company: "Hyundai AutoEver",
        role: "In-vehicle Navigation Development",
        summary:
          "Worked across OEM navigation map rendering, XP2 engine migration, and third-party SDK navigation proof-of-concept work.",
        highlights: [
          "Connect-S/L map display module development",
          "XP2 navigation engine migration",
          "HERE SDK-based third-party navigation PoC"
        ]
      }
    }
  },
  {
    period: "2022.01 ~ 2023.02",
    locales: {
      ko: {
        company: "다이닝코드",
        role: "Android 앱 개발",
        summary:
          "검색, 추천, 평가/체크인, 프로파일/지도, 커뮤니티 안전 기능까지 폭넓은 Android 앱 기능 개발과 화면 개선을 담당했습니다.",
        highlights: [
          "통합검색과 자동완성 구조 설계",
          "레거시 Java/MVC 화면의 Kotlin/MVVM 전환",
          "운영 서비스 안정성 개선"
        ]
      },
      en: {
        company: "DiningCode",
        role: "Android App Development",
        summary:
          "Worked on Android feature delivery and screen improvements across search, recommendations, reviews, map flows, and safety features.",
        highlights: [
          "Integrated search and autocomplete architecture",
          "Java/MVC to Kotlin/MVVM migration",
          "Production stability improvements"
        ]
      }
    }
  }
] as const;
