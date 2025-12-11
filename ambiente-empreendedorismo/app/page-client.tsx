"use client";

import Link from "next/link";
import Header from "@/components/Header";
import { RocketLaunchIcon, LightBulbIcon, ArrowTrendingUpIcon } from '@heroicons/react/24/outline';
import { motion } from "framer-motion";
import AnimatedCards from "@/components/AnimatedCards";
import MissionSection from "@/components/MissionSection";
import { Instagram, Linkedin } from "lucide-react";
import { useEffect, useState } from "react";

export const metadata = {
  title: "AEI - Ambiente de Empreendedorismo e Inovação",
  description: "Capacitando empreendedores universitários",
};

export default function Home() {
  const [videoSrc, setVideoSrc] = useState("");

  useEffect(() => {
    function updateVideo() {
      const width = window.innerWidth;

      if (width >= 1483) {
        setVideoSrc("/assets/home_video_lg.mp4");
      } else if (width >= 1110) {
        setVideoSrc("/assets/home_video_md.mp4");
      } else {
        setVideoSrc("/assets/home_video_sm.mp4");
      }
    }

    updateVideo();
    window.addEventListener("resize", updateVideo);
    return () => window.removeEventListener("resize", updateVideo);
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-zinc-50">
      <Header />

      <main className="flex-grow">
        
       <section className="relative aspect-video w-full max-h-[400px] overflow-hidden items-center justify-center flex">
        {videoSrc && (
          <video
            key={videoSrc}
            src={videoSrc}
            className="absolute inset-0 w-full h-full object-cover"
            autoPlay
            loop
            muted
            playsInline
          />
        )}

        <div className="absolute inset-0 opacity-20 bg-[url('/assets/background.jpg')] bg-cover bg-center"></div>

        <div className="relative z-10 text-center px-4 max-w-4xl">
          <h1 className="text-xl md:text-6xl text-black font-bold mb-3 md:mb-6">
            Ambiente de Empreendedorismo e Inovação
          </h1>

          <p className="text-xs md:text-xl mb-4 md:mb-8 text-gray-700">
            Na AEI, capacitamos empreendedores iniciantes com as ferramentas,
            a comunidade e a orientação necessárias para transformar ideias
            inovadoras em negócios prósperos. Junte-se a nós para desbloquear
            todo o seu potencial.
          </p>

          <div className="flex gap-2 md:gap-4 justify-center">
            <Link
              href="/about"
              className="px-3 py-1.5 md:px-8 md:py-3 bg-[#2E2B82] text-white text-xs md:text-base font-bold rounded-full hover:bg-[#292570] transition"
            >
              Saiba Mais
            </Link>

            <Link
              href="/contact"
              className="px-3 py-1.5 md:px-8 md:py-3 border-2 border-black text-black text-xs md:text-base font-bold rounded-full hover:bg-white/15 transition"
            >
              Fale Conosco
            </Link>
          </div>
        </div>
      </section>

        <MissionSection />

        <section className="py-16 container mx-auto px-6 mb-10">
          <h1 className="text-4xl font-bold text-black text-center">Como podemos ajudar você a ter sucesso</h1>
          <p className="text-lg text-gray-600 text-center mt-5 mb-10">
            Desde ideias inovadoras até o domínio do mercado, a AEI oferece um conjunto de serviços projetados para <br /> 
            acelerar a sua jornada empreendedora.
          </p>

          <AnimatedCards />
        </section>

        <section
          className="relative h-[500px] flex items-center justify-center text-white bg-cover bg-center"
          style={{ backgroundImage: "url('/assets/final_home_img.jpg')" }}
        >
          <div className="absolute inset-0 bg-blue-900/60"></div>

          <div className="absolute inset-0 opacity-20 bg-[url('/assets/background.jpg')] bg-cover bg-center"></div>
          <div className="relative z-10 text-center px-3 max-w-4xl">
            <h1 className="text-2xl text-white md:text-4xl font-bold mb-6">
              Explore nosso portfólio de histórias de sucesso.
            </h1>
            <p className="text-sm md:text-md mb-8 text-white">
              Veja como a AEI ajudou alunos fundadores visionários a construir empresas impactantes e bem-sucedidas. Inspire-se e encontre sua próxima grande inovação.
            </p>
            <div className="flex gap-4 justify-center">
              <Link 
                href="/news " 
                className="px-15 py-3 bg-[#2E2B82] text-white font-bold rounded-lg hover:bg-[#292570] transition text-sm md:text-base"
              >
                Ver Notícias
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-white text-gray-500 py-6 px-8">
        <div className="container mx-auto flex flex-col md:flex-row items-center md:items-start justify-center md:justify-between gap-6 md:gap-0">
          
          <div className="w-full md:w-1/3 text-center md:text-left">
            <p className="text-xs">
              © {new Date().getFullYear()} AEI - Ambiente de Empreendedorismo e Inovação. <br />
              Todos os direitos reservados.
            </p>
          </div>

          <div className="w-full md:w-1/3 flex flex-row justify-center gap-6 text-center text-sm">
            <Link href="/privacy-policy" className="hover:underline">
              Política de Privacidade
            </Link>
            <Link href="/terms" className="hover:underline">
              Termos de Serviço
            </Link>
            <Link href="/contact" className="hover:underline">
              Contate-nos
            </Link>
          </div>

          <div className="w-full md:w-1/3 flex justify-center md:justify-end gap-4">
            <Link 
              href="https://instagram.com"
              target="_blank"
              className="hover:text-gray-300 transition"
            >
              <Instagram size={22} />
            </Link>
            <Link 
              href="https://linkedin.com"
              target="_blank"
              className="hover:text-gray-300 transition"
            >
              <Linkedin size={22} />
            </Link>
          </div>

        </div>
      </footer>
    </div>
  );
}