import { onRequest as __geo_ts_onRequest } from "C:\\Users\\footb\\dev\\CampusCribs\\campuscribs-frontend\\functions\\geo.ts"

export const routes = [
    {
      routePath: "/geo",
      mountPath: "/",
      method: "",
      middlewares: [],
      modules: [__geo_ts_onRequest],
    },
  ]