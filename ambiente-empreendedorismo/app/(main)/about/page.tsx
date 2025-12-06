// app/about/page.tsx
export default function AboutPage() {
  return (
    <div className="bg-gray-50 py-12 min-h-screen">
      <div className="container mx-auto max-w-4xl p-6 bg-white shadow-lg rounded-lg">
        
        <h1 className="text-4xl font-bold text-[#2E2B82] text-center mb-8">
          Sobre o AEI
        </h1>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">O que é?</h2>
          <p className="text-gray-700 leading-relaxed">
            O Ambiente de Empreendedorismo e Inovação (AEI) é uma iniciativa
            visionária dedicada a fomentar a cultura empreendedora e a 
            impulsionar a inovação em diversas frentes. Nascemos do desejo 
            de criar um ecossistema vibrante onde ideias promissoras possam 
            germinar, crescer e se transformar em negócios de impacto.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Nossa Missão</h2>
          <p className="text-gray-700 leading-relaxed">
            Conectar mentes criativas, fornecer recursos essenciais e 
            oferecer o suporte necessário para que empreendedores, 
            estudantes e pesquisadores possam desenvolver seus projetos e 
            contribuir para o progresso tecnológico e social.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">O que fazemos?</h2>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li>Incubação de startups e projetos inovadores.</li>
            <li>Promoção de eventos, workshops e hackathons.</li>
            <li>Programas de mentoria com especialistas de mercado.</li>
            <li>Facilitação de networking e parcerias estratégicas.</li>
            <li>Apoio na captação de investimentos e fomento.</li>
          </ul>
        </section>

      </div>
    </div>
  );
}