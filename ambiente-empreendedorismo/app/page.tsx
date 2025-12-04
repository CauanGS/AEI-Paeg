import Link from "next/link";
import Header from "@/components/Header"; // Importando seu componente Header

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-zinc-50">
      <Header /> {/* Seu Header fixo */}

      <main className="flex-grow">
        {/* Seção Hero (Banner Principal) */}
        <section className="relative h-[500px] flex items-center justify-center bg-[#2E2B82] text-white">
          <div className="absolute inset-0 opacity-20 bg-[url('/assets/background.jpg')] bg-cover bg-center"></div>
          <div className="relative z-10 text-center px-4 max-w-4xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Ambiente de Empreendedorismo e Inovação
            </h1>
            <p className="text-lg md:text-xl mb-8 text-zinc-200">
              Transformando ideias em realidade através da tecnologia, inovação e suporte ao empreendedor.
            </p>
            <div className="flex gap-4 justify-center">
              <Link 
                href="/about" 
                className="px-8 py-3 bg-white text-[#2E2B82] font-bold rounded-full hover:bg-zinc-100 transition"
              >
                Saiba Mais
              </Link>
              <Link 
                href="/contact" 
                className="px-8 py-3 border-2 border-white text-white font-bold rounded-full hover:bg-white/10 transition"
              >
                Fale Conosco
              </Link>
            </div>
          </div>
        </section>

        {/* Seção de Resumo dos Módulos */}
        <section className="py-16 container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Card Notícias */}
            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition border-t-4 border-[#2E2B82]">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Notícias</h3>
              <p className="text-gray-600 mb-6">
                Fique por dentro das últimas novidades, atualizações e conquistas do nosso ecossistema.
              </p>
              <Link href="/news" className="text-[#2E2B82] font-semibold hover:underline">
                Ver Notícias &rarr;
              </Link>
            </div>

            {/* Card Eventos */}
            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition border-t-4 border-[#2E2B82]">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Eventos</h3>
              <p className="text-gray-600 mb-6">
                Participe de workshops, palestras e encontros de networking promovidos pelo AEI.
              </p>
              <Link href="/events" className="text-[#2E2B82] font-semibold hover:underline">
                Próximos Eventos &rarr;
              </Link>
            </div>

            {/* Card Projetos */}
            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition border-t-4 border-[#2E2B82]">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Projetos</h3>
              <p className="text-gray-600 mb-6">
                Conheça os projetos inovadores que estão sendo desenvolvidos com o nosso apoio.
              </p>
              <Link href="/projetos" className="text-[#2E2B82] font-semibold hover:underline">
                Conhecer Projetos &rarr;
              </Link>
            </div>

          </div>
        </section>
      </main>

      {/* Footer Simples */}
      <footer className="bg-gray-900 text-white py-8 text-center">
        <p>© {new Date().getFullYear()} AEI - Ambiente de Empreendedorismo e Inovação. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}