import Link from "next/link";
import { RocketLaunchIcon } from '@heroicons/react/24/outline';

export default function NotFoundPage() {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-50 px-4">
      <div className="flex flex-col items-center text-center max-w-md">

        <div className="flex items-center gap-3 mb-1">
          <div className="p-2 rounded-lg bg-[#2E2B82]">
            <RocketLaunchIcon className="w-6 h-6 text-white" />
          </div>

          <h2 className="text-xl font-semibold text-[#2E2B82]">
            Ambiente de Empreendedorismo e Inovação
          </h2>
        </div>

        <img
          src="/assets/404.png"
          alt="404 Not Found"
          className="w-70 h-70 object-contain mb-1"
        />

        <h1 className="text-8xl font-black text-[#2E2B82]">404</h1>

        <h2 className="text-2xl font-semibold text-gray-800 mt-4">
          Ops! Esta página deu uma desviada do caminho.
        </h2>

        <p className="text-gray-600 mt-2">
          Parece que a página que você está procurando desapareceu
          no cosmos do empreendedorismo.
        </p>

        <Link
          href="/"
          className="mt-6 inline-block px-6 py-3 text-white font-semibold bg-[#2E2B82] rounded-lg hover:bg-[#25236d] transition"
        >
          Voltar ao início
        </Link>
      </div>
    </div>
  );
}
