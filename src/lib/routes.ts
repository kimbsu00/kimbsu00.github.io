export type Locale = "ko" | "en";

export type Route =
  | { locale: Locale; page: "home" }
  | { locale: Locale; page: "project"; slug: string };

export function normalizePath(pathname: string): string {
  if (pathname === "/") {
    return "/ko/";
  }

  return pathname.endsWith("/") ? pathname : `${pathname}/`;
}

export function parseRoute(pathname: string): Route {
  const path = normalizePath(pathname);
  const parts = path.split("/").filter(Boolean);
  const locale = parts[0] === "en" ? "en" : "ko";

  if (parts[1] === "projects" && parts[2]) {
    return {
      locale,
      page: "project",
      slug: parts[2]
    };
  }

  return {
    locale,
    page: "home"
  };
}
