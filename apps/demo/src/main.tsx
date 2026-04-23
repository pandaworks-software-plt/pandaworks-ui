import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import ShowcaseApp from "./showcase/showcase-app";
import SaasApp from "./saas/saas-app";

const base = import.meta.env.BASE_URL.replace(/\/$/, "");
const pathname = window.location.pathname.replace(/\/$/, "");
const isSaas = pathname === `${base}/saas-showcase`;

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {isSaas ? <SaasApp /> : <ShowcaseApp />}
  </StrictMode>,
);
