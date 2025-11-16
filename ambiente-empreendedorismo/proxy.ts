// proxy.ts (na raiz do projeto ou em /src)
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(req: NextRequest) {
  const url = req.nextUrl.clone();
  const token = req.cookies.get("token")?.value;
  const pathname = req.nextUrl.pathname;

  // Se o usuário está logado e tenta acessar /login => leva para /
  if (token && pathname === "/login") {
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  if (token && pathname === "/cadastro") {
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  // Se o usuário NÃO está logado e tenta acessar / (home) => leva para /login
  if (!token && pathname === "/") {
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/login", "/cadastro"],
};
