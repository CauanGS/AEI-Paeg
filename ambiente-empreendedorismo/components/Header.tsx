"use client";
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X } from "lucide-react";
import { useState } from "react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-md w-full relative">
      
      <nav className="container mx-auto flex items-center justify-between p-4">
        
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

        <div className="hidden lg:flex items-center gap-6 text-sm font-medium text-gray-700">
          <Link href="/about" className="hover:text-[#2E2B82] relative after:content-[''] after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-full after:bg-[#2E2B82] after:scale-x-0 after:transition-transform after:duration-300 hover:after:scale-x-100">Sobre</Link>
          <Link href="/events" className="hover:text-[#2E2B82] relative after:content-[''] after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-full after:bg-[#2E2B82] after:scale-x-0 after:transition-transform after:duration-300 hover:after:scale-x-100">Eventos</Link>
          <Link href="/programs" className="hover:text-[#2E2B82] relative after:content-[''] after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-full after:bg-[#2E2B82] after:scale-x-0 after:transition-transform after:duration-300 hover:after:scale-x-100">Programas</Link>
          <Link href="/projects" className="hover:text-[#2E2B82] relative after:content-[''] after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-full after:bg-[#2E2B82] after:scale-x-0 after:transition-transform after:duration-300 hover:after:scale-x-100">Projetos</Link>
          <Link href="/news" className="hover:text-[#2E2B82] relative after:content-[''] after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-full after:bg-[#2E2B82] after:scale-x-0 after:transition-transform after:duration-300 hover:after:scale-x-100">Notícias</Link>
          <Link href="/ventures" className="hover:text-[#2E2B82] relative after:content-[''] after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-full after:bg-[#2E2B82] after:scale-x-0 after:transition-transform after:duration-300 hover:after:scale-x-100">Empreendimentos</Link>
          <Link href="/contact" className="hover:text-[#2E2B82] relative after:content-[''] after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-full after:bg-[#2E2B82] after:scale-x-0 after:transition-transform after:duration-300 hover:after:scale-x-100">Contato</Link>
        </div>

        <div className="hidden lg:block">
          <Link
            href="/login"
            className="bg-[#2E2B82] text-white px-4 py-2 rounded-md text-sm font-bold hover:bg-[#292570]"
          >
            Login
          </Link>
        </div>

      </nav>

      {isMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-white shadow-md lg:hidden flex flex-col items-center gap-4 py-6 text-gray-700 text-base font-medium z-50">
          <Link href="/about" onClick={() => setIsMenuOpen(false)} className="hover:text-[#2E2B82]">Sobre</Link>
          <Link href="/events" onClick={() => setIsMenuOpen(false)} className="hover:text-[#2E2B82]">Eventos</Link>
          <Link href="/programs" onClick={() => setIsMenuOpen(false)} className="hover:text-[#2E2B82]">Programas</Link>
          <Link href="/projects" onClick={() => setIsMenuOpen(false)} className="hover:text-[#2E2B82]">Projetos</Link>
          <Link href="/news" onClick={() => setIsMenuOpen(false)} className="hover:text-[#2E2B82]">Notícias</Link>
          <Link href="/ventures" onClick={() => setIsMenuOpen(false)} className="hover:text-[#2E2B82]">Empreendimentos</Link>
          <Link href="/contact" onClick={() => setIsMenuOpen(false)} className="hover:text-[#2E2B82]">Contato</Link>

          <Link
            href="/login"
            onClick={() => setIsMenuOpen(false)}
            className="w-11/12 text-center border-2 border-[#2E2B82] text-[#2E2B82] py-2 rounded-lg font-semibold text-base hover:bg-[#2E2B82] hover:text-white transition"
          >
            Login
          </Link>
        </div>
      )}

    </header>
  );
}