"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { RocketLaunchIcon, LightBulbIcon, ArrowTrendingUpIcon } from "@heroicons/react/24/outline";

export default function AnimatedCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-13">

      {/* Card 1 */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition"
      >
        <RocketLaunchIcon className="w-10 h-10 text-[#2E2B82] mb-3" />
        <h3 className="text-2xl font-bold text-gray-800 mb-4">Incubação de Startups</h3>
        <p className="text-gray-600 mb-6">
          Suporte completo desde a concepção da ideia até o lançamento no mercado.
        </p>
        <Link href="/entrepreneurship" className="text-[#2E2B82] font-semibold hover:underline">
          Ver Empreendimentos →
        </Link>
      </motion.div>

      {/* Card 2 */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition"
      >
        <LightBulbIcon className="w-10 h-10 text-[#2E2B82] mb-3" />
        <h3 className="text-2xl font-bold text-gray-800 mb-4">Mentoria & Orientação</h3>
        <p className="text-gray-600 mb-6">
          Obtenha aconselhamento personalizado e orientação estratégica.
        </p>
        <Link href="/events" className="text-[#2E2B82] font-semibold hover:underline">
          Próximos Eventos →
        </Link>
      </motion.div>

      {/* Card 3 */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition"
      >
        <ArrowTrendingUpIcon className="w-10 h-10 text-[#2E2B82] mb-3" />
        <h3 className="text-2xl font-bold text-gray-800 mb-4">Financiamento & Projetos</h3>
        <p className="text-gray-600 mb-6">
          Acesso a investidores e ajuda no desenvolvimento de projetos inovadores.
        </p>
        <Link href="/projects" className="text-[#2E2B82] font-semibold hover:underline">
          Conhecer Projetos →
        </Link>
      </motion.div>

    </div>
  );
}