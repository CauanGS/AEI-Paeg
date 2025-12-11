"use client";

import { motion } from "framer-motion";

export default function MissionSection() {
  return (
    <section className="relative h-auto md:h-[500px] flex items-center bg-[#FFFFFF] text-[#2E2B82] px-4 md:px-8 py-8 md:py-0">
      <div className="container mx-auto flex flex-col md:flex-row items-center md:items-center justify-between gap-6 h-full">
        
        <div className="w-full md:w-1/2 space-y-4 text-center md:text-left">
          <h1 className="text-xl md:text-4xl font-bold md:mt-0">
            Nossa Missão &amp; Valores
          </h1>

          <p className="text-sm md:text-lg text-gray-600">
            Imaginamos um mundo onde toda ideia inovadora tenha a oportunidade de prosperar.
            Nossa missão é democratizar o empreendedorismo na universidade, fornecendo recursos acessíveis,
            mentoria especializada e uma rede de apoio para alunos em todas as fases. <br /><br />
            Estamos empenhados em fomentar um ecossistema vibrante onde a criatividade encontra o comércio,
            impulsionando o crescimento econômico e o impacto social por meio de empreendimentos sustentáveis.
          </p>
        </div>

        <motion.div
          initial={{ x: 150, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
          className="w-full md:w-1/2 flex justify-center md:justify-end mt-4 md:mt-0"
        >
          <img
            src="/assets/home_img.jpg"
            alt="Imagem"
            className="w-full max-w-sm md:max-w-md rounded-xl shadow-lg mb-5 md:mb-0 object-cover"
          />
        </motion.div>

      </div>
    </section>
  );
}