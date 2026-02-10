import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  // Si ya viene autorizado, dejar pasar
  if (searchParams.get("from") === "landing") {
    return NextResponse.next();
  }

  // Si entra directo a /i/[slug]
  if (pathname.startsWith("/i/")) {
    const slug = pathname.replace("/i/", "");

    const url = request.nextUrl.clone();
    url.pathname = "/";
    url.searchParams.set("invitado", slug);

    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}
