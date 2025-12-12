import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const pathname = req.nextUrl.pathname;

  const url = req.nextUrl.clone();
  const authPages = ["/login", "/cadastro"];

  if (token && authPages.includes(pathname)) {
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/login", "/cadastro"], // Só rodar onde é necessário
};