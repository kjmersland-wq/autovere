import { createServerFn } from "@tanstack/react-start";
import { getRequestHeader } from "@tanstack/react-start/server";

/** Reads the visitor country from the edge request headers. */
export const getVisitorGeo = createServerFn({ method: "GET" }).handler(async () => {
  const country =
    getRequestHeader("cf-ipcountry") ??
    getRequestHeader("x-vercel-ip-country") ??
    getRequestHeader("x-country-code") ??
    null;
  const city = getRequestHeader("cf-ipcity") ?? null;
  return { country: country && country !== "XX" ? country.toUpperCase() : null, city };
});
