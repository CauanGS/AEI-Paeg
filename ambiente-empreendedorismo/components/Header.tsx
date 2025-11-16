import Link from 'next/link';
import Image from 'next/image';

export default function Header() {
  return (
    <header className="bg-white shadow-md w-full">
      <nav className="container mx-auto flex items-center justify-between p-4">
        {}
        <Link href="/" className="flex items-center gap-3">
          <Image 
            src="/assets/logo.png"
            alt="Logo AEI" 
            width={50} 
            height={50}
            className="object-contain"
          />
          <h1 className="text-sm font-semibold leading-tight text-[#2E2B82]">
            Ambiente de <br /> empreendedorismo <br /> e inovação
          </h1>
        </Link>

        {}
        <div className="flex items-center gap-6 text-sm font-medium text-gray-700">
          <Link href="/about" className="hover:text-[#2E2B82]">Sobre</Link>
          <Link href="/events" className="hover:text-[#2E2B82]">Eventos</Link>
          <Link href="/programs" className="hover:text-[#2E2B82]">Programas</Link>
          <Link href="/projects" className="hover:text-[#2E2B82]">Projetos</Link>
          <Link href="/news" className="hover:text-[#2E2B82]">Notícias</Link>
          <Link href="/ventures" className="hover:text-[#2E2B82]">Empreendimentos</Link>
          <Link href="/contact" className="hover:text-[#2E2B82]">Contato</Link>
        </div>

        {}
        <div>
          <Link href="/login" className="bg-[#2E2B82] text-white px-4 py-2 rounded-md text-sm font-bold hover:bg-[#292570]">
            Login
          </Link>
        </div>
      </nav>
    </header>
  );
}