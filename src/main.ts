import "./style.css";
import { renderApp } from "./app.js";
import { parseRoute } from "./lib/routes.js";

const app = document.querySelector<HTMLDivElement>("#app");

if (!app) {
  throw new Error("App root not found");
}

const route = parseRoute(window.location.pathname);

app.innerHTML = renderApp(route);
