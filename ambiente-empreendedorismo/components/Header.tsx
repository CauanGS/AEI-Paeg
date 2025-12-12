"use client";
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [logged, setLogged] = useState<boolean | null>(null);
  const pathname = usePathname();
  const router = useRouter();

  // Verifica login
  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => setLogged(data.isLogged))
      .catch(() => setLogged(false));
  }, []);

  // LOGOUT
  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });

    setLogged(false);
    router.replace("/login");
  };

  if (logged === null) return null;

  const isActive = (path: string) =>
    pathname === path
      ? "text-[#2E2B82] font-bold after:scale-x-100"
      : "text-gray-700";

  return (
    <header className="bg-white shadow-md w-full relative">
      <nav className="container mx-auto flex items-center justify-between p-4">

        {/* LOGO */}
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/assets/logo.png"
            alt="Logo AEI"
            width={50}
            height={50}
            className="object-contain"
          />
          <h1 className="text-sm font-semibold leading-tight text-[#2E2B82] hidden lg:block">
            Ambiente de <br /> empreendedorismo <br /> e inovação
          </h1>
        </Link>

        {/* MENU MOBILE */}
        <button
          className="lg:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? (
            <X size={28} className="text-[#2E2B82]" />
          ) : (
            <Menu size={28} className="text-[#2E2B82]" />
          )}
        </button>

        {/* MENU DESKTOP */}
        <div className="hidden lg:flex items-center gap-6 text-sm font-medium">
          <Link
            href="/about"
            className={`relative after:content-[''] after:absolute after:left-0 after:-bottom-1 
              after:h-[2px] after:w-full after:bg-[#2E2B82] after:scale-x-0 
              after:transition-transform after:duration-300 hover:after:scale-x-100
              ${pathname === "/about" ? "text-[#2E2B82] font-bold" : "text-gray-700"}`}
          >
            Sobre
          </Link>

          <Link
            href="/events"
            className={`relative after:content-[''] after:absolute after:left-0 after:-bottom-1 
              after:h-[2px] after:w-full after:bg-[#2E2B82] after:scale-x-0 
              after:transition-transform after:duration-300 hover:after:scale-x-100
              ${pathname === "/events" ? "text-[#2E2B82] font-bold" : "text-gray-700"}`}
          >
            Eventos
          </Link>

          <Link
            href="/programs"
            className={`relative after:content-[''] after:absolute after:left-0 after:-bottom-1 
              after:h-[2px] after:w-full after:bg-[#2E2B82] after:scale-x-0 
              after:transition-transform after:duration-300 hover:after:scale-x-100
              ${pathname === "/programs" ? "text-[#2E2B82] font-bold" : "text-gray-700"}`}
          >
            Programas
          </Link>

          <Link
            href="/projects"
            className={`relative after:content-[''] after:absolute after:left-0 after:-bottom-1 
              after:h-[2px] after:w-full after:bg-[#2E2B82] after:scale-x-0 
              after:transition-transform after:duration-300 hover:after:scale-x-100
              ${pathname === "/projects" ? "text-[#2E2B82] font-bold" : "text-gray-700"}`}
          >
            Projetos
          </Link>

          <Link
            href="/news"
            className={`relative after:content-[''] after:absolute after:left-0 after:-bottom-1 
              after:h-[2px] after:w-full after:bg-[#2E2B82] after:scale-x-0 
              after:transition-transform after:duration-300 hover:after:scale-x-100
              ${pathname === "/news" ? "text-[#2E2B82] font-bold" : "text-gray-700"}`}
          >
            Notícias
          </Link>

          <Link
            href="/entrepreneurship"
            className={`relative after:content-[''] after:absolute after:left-0 after:-bottom-1 
              after:h-[2px] after:w-full after:bg-[#2E2B82] after:scale-x-0 
              after:transition-transform after:duration-300 hover:after:scale-x-100
              ${pathname === "/entrepreneurship" ? "text-[#2E2B82] font-bold" : "text-gray-700"}`}
          >
            Empreendimentos
          </Link>

          <Link
            href="/contact"
            className={`relative after:content-[''] after:absolute after:left-0 after:-bottom-1 
              after:h-[2px] after:w-full after:bg-[#2E2B82] after:scale-x-0 
              after:transition-transform after:duration-300 hover:after:scale-x-100
              ${pathname === "/contact" ? "text-[#2E2B82] font-bold" : "text-gray-700"}`}
          >
            Contato
          </Link>
        </div>

        <div className="hidden lg:block">
          {!logged ? (
            <Link
              href="/login"
              className="bg-[#2E2B82] text-white px-4 py-2 rounded-md text-sm font-bold hover:bg-[#292570]"
            >
              Login
            </Link>
          ) : (
            <button
              onClick={handleLogout}
              className="bg-red-600 cursor-pointer text-white px-4 py-2 rounded-md text-sm font-bold hover:bg-red-700"
            >
              Sair
            </button>
          )}
        </div>

      </nav>

      {/* MENU MOBILE ABERTO */}
      {isMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-white shadow-md lg:hidden flex flex-col items-center gap-4 py-6 text-gray-700 text-base font-medium z-50">

          <Link href="/about" onClick={() => setIsMenuOpen(false)} className={isActive("/about")}>Sobre</Link>
          <Link href="/events" onClick={() => setIsMenuOpen(false)} className={isActive("/events")}>Eventos</Link>
          <Link href="/programs" onClick={() => setIsMenuOpen(false)} className={isActive("/programs")}>Programas</Link>
          <Link href="/projects" onClick={() => setIsMenuOpen(false)} className={isActive("/projects")}>Projetos</Link>
          <Link href="/news" onClick={() => setIsMenuOpen(false)} className={isActive("/news")}>Notícias</Link>
          <Link href="/entrepreneurship" onClick={() => setIsMenuOpen(false)} className={isActive("/entrepreneurship")}>Empreendimentos</Link>
          <Link href="/contact" onClick={() => setIsMenuOpen(false)} className={isActive("/contact")}>Contato</Link>

          {/* LOGIN / LOGOUT MOBILE */}
          {!logged ? (
            <Link
              href="/login"
              onClick={() => setIsMenuOpen(false)}
              className="w-11/12 text-center border-2 border-[#2E2B82] text-[#2E2B82] py-2 rounded-lg font-semibold hover:bg-[#2E2B82] hover:text-white transition"
            >
              Login
            </Link>
          ) : (
            <button
              onClick={() => { setIsMenuOpen(false); handleLogout(); }}
              className="w-11/12 cursor-pointer text-center border-2 border-red-600 text-red-600 py-2 rounded-lg font-semibold hover:bg-red-700 transition"
            >
              Sair
            </button>
          )}

        </div>
      )}
    </header>
  );
}
