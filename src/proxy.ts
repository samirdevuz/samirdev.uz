import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  getLocaleFromCountry,
  isLocale,
  localeCookieName,
} from "@/lib/locale";

export function proxy(request: NextRequest) {
  const selectedLocale = request.cookies.get(localeCookieName)?.value;
  const country =
    request.headers.get("x-vercel-ip-country") ??
    request.headers.get("cf-ipcountry") ??
    request.headers.get("x-country-code");
  const locale = isLocale(selectedLocale)
    ? selectedLocale
    : getLocaleFromCountry(country);
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-samir-locale", locale);
  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  if (!isLocale(selectedLocale)) {
    response.cookies.set(localeCookieName, locale, {
      maxAge: 60 * 60 * 24 * 365,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
    });
  }

  return response;
}

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
