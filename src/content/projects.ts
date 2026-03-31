export const projects = [
  {
    slug: "connect-s-l-navigation-controller",
    featured: true,
    locales: {
      ko: {
        title: "Connect-S/L 플랫폼 내비게이션 Controller 개발",
        summary:
          "현대자동차 그룹 신규 차량용 내비게이션 Controller의 지도 표시 모듈을 개발한 프로젝트입니다.",
        detailsAvailable: true,
        highlights: [
          "Google Automotive SDK 기반 Android(Kotlin) 개발",
          "Vector Tile 데이터 요청 구조 설계",
          "EventQueue 및 JNI 연동 구현"
        ]
      },
      en: {
        title: "Connect-S/L Navigation Controller",
        summary:
          "Development of the map display module for the navigation controller of upcoming Hyundai Motor Group vehicles.",
        detailsAvailable: true,
        highlights: [
          "Android development with Google Automotive SDK",
          "Vector Tile request architecture design",
          "EventQueue and JNI integration for the rendering SDK"
        ]
      }
    }
  },
  {
    slug: "pad-ai",
    featured: true,
    locales: {
      ko: {
        title: "PAD-AI",
        summary:
          "파킨슨병과 알츠하이머 조기 진단을 위한 AI 모델 및 데이터 수집 프로젝트입니다.",
        detailsAvailable: true,
        highlights: [
          "2023 KU SW경진대회 우수상 수상",
          "졸업 프로젝트 기반 의료 AI 문제 해결",
          "데이터 수집과 모델링 흐름 설계"
        ]
      },
      en: {
        title: "PAD-AI",
        summary:
          "AI model and data collection project for early diagnosis of Parkinson’s and Alzheimer’s disease.",
        detailsAvailable: false,
        highlights: [
          "Award-winning graduation project",
          "Focused on medical AI and data collection workflow",
          "Detailed narrative is available in Korean"
        ]
      }
    }
  },
  {
    slug: "mobit",
    featured: true,
    locales: {
      ko: {
        title: "Mobit",
        summary: "가상화폐 모의투자 앱",
        detailsAvailable: true,
        highlights: [
          "업비트 시세를 기반으로 한 모의투자 경험",
          "Google Play Store 누적 다운로드 1만회 돌파"
        ]
      },
      en: {
        title: "Mobit",
        summary: "A cryptocurrency paper-trading app",
        detailsAvailable: false,
        highlights: ["Paper trading with live cryptocurrency market data"]
      }
    }
  },
  {
    slug: "xp2-navigation-engine-migration",
    featured: false,
    locales: {
      ko: {
        title: "XP2 플랫폼 내비게이션 엔진 Migration",
        summary: "내비게이션 엔진 이관 작업에 참여한 프로젝트입니다.",
        detailsAvailable: false,
        highlights: ["플랫폼 전환에 필요한 엔진 마이그레이션 대응"]
      },
      en: {
        title: "XP2 Navigation Engine Migration",
        summary: "Navigation engine migration work for the XP2 platform.",
        detailsAvailable: false,
        highlights: ["Platform migration support for the navigation engine"]
      }
    }
  },
  {
    slug: "diningcode-review-screen-improvement",
    featured: false,
    locales: {
      ko: {
        title: "맛집 평가 화면 기능 개선",
        summary: "다이닝코드의 맛집 평가 화면 UI와 구조를 개선한 프로젝트입니다.",
        detailsAvailable: true,
        highlights: [
          "Custom View 디자인 및 버그 수정",
          "MVC를 MVVM으로 전환",
          "Java 코드를 Kotlin으로 전환"
        ]
      },
      en: {
        title: "Restaurant Review Screen Improvement",
        summary:
          "UI and architecture improvements for the restaurant review flow in DiningCode.",
        detailsAvailable: false,
        highlights: [
          "Custom view redesign and bug fixing",
          "MVC to MVVM transition",
          "Java to Kotlin migration"
        ]
      }
    }
  },
  {
    slug: "diningcode-report-block",
    featured: false,
    locales: {
      ko: {
        title: "유저 신고 및 차단 기능 개발",
        summary:
          "Google Play 정책 준수를 위해 신고 및 차단 기능을 새롭게 구현한 프로젝트입니다.",
        detailsAvailable: true,
        highlights: [
          "신고 및 차단 기능 신규 개발",
          "차단 시 해당 유저 게시물 블라인드 처리",
          "정책 준수를 위한 기능 설계"
        ]
      },
      en: {
        title: "User Report and Block Feature",
        summary:
          "Implemented user report and block features to satisfy Google Play policy requirements.",
        detailsAvailable: false,
        highlights: [
          "Added report and block flows",
          "Blinded blocked users’ content",
          "Built for store policy compliance"
        ]
      }
    }
  },
  {
    slug: "diningcode-recommendation-tab",
    featured: false,
    locales: {
      ko: {
        title: "추천 탭 개발",
        summary: "기존 탭을 새로운 추천 탭으로 전환한 프로젝트입니다.",
        detailsAvailable: false,
        highlights: ["구 버전 다코투데이 탭을 추천 탭으로 변경"]
      },
      en: {
        title: "Recommendation Tab",
        summary: "Reworked an existing tab into a new recommendation experience.",
        detailsAvailable: false,
        highlights: ["Replaced the old Daco Today tab with a recommendation tab"]
      }
    }
  },
  {
    slug: "diningcode-search-autocomplete",
    featured: false,
    locales: {
      ko: {
        title: "통합검색 자동완성 기능 개발",
        summary:
          "다이닝코드 사용자가 원하는 조건의 맛집을 더 빨리 찾도록 돕는 자동완성 기능을 구현했습니다.",
        detailsAvailable: true,
        highlights: [
          "검색어 기반 맛집 자동완성 기능 개발",
          "멀티 스레드 기반 아키텍처 설계",
          "검색 경험 향상에 집중"
        ]
      },
      en: {
        title: "Integrated Search Autocomplete",
        summary:
          "Implemented search autocomplete to help users find restaurants that match their intent faster.",
        detailsAvailable: false,
        highlights: [
          "Keyword-based autocomplete",
          "Multi-threaded architecture design",
          "Focused on search UX"
        ]
      }
    }
  },
  {
    slug: "diningcode-brain-structure-tags",
    featured: false,
    locales: {
      ko: {
        title: "뇌구조 및 지역태그 기능 개발",
        summary:
          "이용자의 음식 취향과 관심 지역을 반영한 개인화 기능을 추가한 프로젝트입니다.",
        detailsAvailable: false,
        highlights: ["음식 취향 및 관심 지역 기반 개인화 기능 구현"]
      },
      en: {
        title: "Brain Structure and Region Tags",
        summary:
          "Personalization work based on food preferences and regions of interest.",
        detailsAvailable: false,
        highlights: ["Implemented personalized preference and regional tags"]
      }
    }
  },
  {
    slug: "diningcode-check-in-improvement",
    featured: false,
    locales: {
      ko: {
        title: "체크인 화면 기능 개선",
        summary: "체크인 화면 구조 개선과 미디어 처리 고도화를 진행한 프로젝트입니다.",
        detailsAvailable: true,
        highlights: [
          "MVC를 MVVM으로 전환",
          "깜빡임 이슈 해결",
          "Exif 메타데이터 업로드 지원"
        ]
      },
      en: {
        title: "Check-in Screen Improvement",
        summary:
          "Refined the check-in flow with architecture cleanup and richer media handling.",
        detailsAvailable: false,
        highlights: [
          "MVC to MVVM migration",
          "Resolved gallery flicker issue",
          "Added Exif metadata upload"
        ]
      }
    }
  },
  {
    slug: "diningcode-search-tab-renewal",
    featured: false,
    locales: {
      ko: {
        title: "검색 탭 리뉴얼",
        summary: "검색 탭 구조를 재정비해 확장성과 검색 경험을 개선한 프로젝트입니다.",
        detailsAvailable: false,
        highlights: ["검색창, 통합검색, 리스트, 지도 구조 재정비"]
      },
      en: {
        title: "Search Tab Renewal",
        summary:
          "Restructured the search tab to improve scalability and the overall search experience.",
        detailsAvailable: false,
        highlights: ["Reworked search, list, and map flow architecture"]
      }
    }
  },
  {
    slug: "diningcode-profile-map-improvement",
    featured: false,
    locales: {
      ko: {
        title: "맛집 프로파일 및 프로파일 지도 화면 개선",
        summary:
          "맛집 정보 화면과 지도 화면을 개선하며 광고 및 지도 플랫폼 변경을 다룬 프로젝트입니다.",
        detailsAvailable: false,
        highlights: ["Google AdMob 추가", "Google Map에서 Naver Map으로 전환"]
      },
      en: {
        title: "Restaurant Profile and Map Improvement",
        summary:
          "Improved the restaurant profile and profile map flows, including ad and map-platform changes.",
        detailsAvailable: false,
        highlights: ["Added Google AdMob", "Migrated from Google Map to Naver Map"]
      }
    }
  },
  {
    slug: "mzti",
    featured: false,
    locales: {
      ko: {
        title: "MZTI",
        summary:
          "다른 MBTI를 이해할 수 있도록 돕는 해커톤 프로젝트입니다.",
        detailsAvailable: false,
        highlights: ["제1회 건국대학교 해커톤 우수상 수상"]
      },
      en: {
        title: "MZTI",
        summary:
          "Hackathon project designed to help users understand people with different MBTI types.",
        detailsAvailable: false,
        highlights: ["Won an excellence award at the 1st Konkuk University Hackathon"]
      }
    }
  },
  {
    slug: "zepetalk",
    featured: false,
    locales: {
      ko: {
        title: "Zepetalk",
        summary: "Naver Zepeto API를 활용한 지도 기반 SNS 앱입니다.",
        detailsAvailable: true,
        highlights: [
          "지도에서 실시간 주변 게시글 확인 및 작성",
          "Zepeto 캐릭터 합성 이미지 첨부",
          "댓글 기능 구현"
        ]
      },
      en: {
        title: "Zepetalk",
        summary: "A map-based social networking app using the Naver Zepeto API.",
        detailsAvailable: false,
        highlights: [
          "Nearby map-based posting and browsing",
          "Composited Zepeto character images",
          "Comment functionality"
        ]
      }
    }
  }
] as const;
