import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type Route =
  | { name: "dashboard" }
  | { name: "projects" }
  | { name: "project"; id: string; tab?: string }
  | { name: "team" }
  | { name: "reports" }
  | { name: "settings"; tab?: string };

interface RouterContextValue {
  route: Route;
  navigate: (route: Route) => void;
  hrefFor: (route: Route) => string;
}

const RouterContext = createContext<RouterContextValue | null>(null);

function parseHash(hash: string): Route {
  const clean = hash.replace(/^#\/?/, "");
  if (!clean) return { name: "dashboard" };
  const [path, query = ""] = clean.split("?");
  const parts = path.split("/").filter(Boolean);
  const params = new URLSearchParams(query);
  const tab = params.get("tab") ?? undefined;

  if (parts[0] === "projects" && parts[1]) return { name: "project", id: parts[1], tab };
  if (parts[0] === "projects") return { name: "projects" };
  if (parts[0] === "team") return { name: "team" };
  if (parts[0] === "reports") return { name: "reports" };
  if (parts[0] === "settings") return { name: "settings", tab };
  return { name: "dashboard" };
}

function hrefFor(route: Route): string {
  switch (route.name) {
    case "dashboard":
      return "#/dashboard";
    case "projects":
      return "#/projects";
    case "project":
      return `#/projects/${route.id}${route.tab ? `?tab=${route.tab}` : ""}`;
    case "team":
      return "#/team";
    case "reports":
      return "#/reports";
    case "settings":
      return `#/settings${route.tab ? `?tab=${route.tab}` : ""}`;
  }
}

export function RouterProvider({ children }: { children: ReactNode }) {
  const [route, setRoute] = useState<Route>(() => parseHash(window.location.hash));

  useEffect(() => {
    const onHash = () => setRoute(parseHash(window.location.hash));
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  useEffect(() => {
    if (!window.location.hash) window.location.hash = "#/dashboard";
  }, []);

  const navigate = useCallback((next: Route) => {
    window.location.hash = hrefFor(next);
  }, []);

  const value = useMemo<RouterContextValue>(() => ({ route, navigate, hrefFor }), [route, navigate]);
  return <RouterContext.Provider value={value}>{children}</RouterContext.Provider>;
}

export function useRouter() {
  const ctx = useContext(RouterContext);
  if (!ctx) throw new Error("useRouter must be used within RouterProvider");
  return ctx;
}
