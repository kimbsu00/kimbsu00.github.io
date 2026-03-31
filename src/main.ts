import "./style.css";
import { renderHome, renderNotFound } from "./app.js";
import { parseRoute } from "./lib/routes.js";

const app = document.querySelector<HTMLDivElement>("#app");

if (!app) {
  throw new Error("App root not found");
}

const route = parseRoute(window.location.pathname);

app.innerHTML =
  route.page === "home" ? renderHome(route.locale) : renderNotFound(route.locale);
