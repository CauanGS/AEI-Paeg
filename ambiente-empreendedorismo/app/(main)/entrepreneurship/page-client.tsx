    "use client";

    import { useState, useEffect } from 'react';
    import Link from 'next/link';

    interface EntrepreneurshipItem {
    id: number;
    title: string;
    description: string;
    type: string;
    tag: string;
    image_path: string | null;
    created_at: string;
    }

    export default function EntrepreneurshipPage() {
    const [entrepreneurship, setEntrepreneurship] = useState<EntrepreneurshipItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchEntrepreneurship = async () => {
        try {
            const response = await fetch('/api/entrepreneurship');
            const data = await response.json();
            setEntrepreneurship(data);
        } catch (error) {
            console.error("Falha ao buscar empreendimentos:", error);
        } finally {
            setIsLoading(false);
        }
        };

        fetchEntrepreneurship();
    }, []);

    if (isLoading) {
        return (
        <div className="container mx-auto p-8 text-center">
            Carregando empreendimentos...
        </div>
        );
    }

    if (entrepreneurship.length === 0) {
        return (
          <div className="flex flex-col min-h-screen bg-cover bg-center bg-gray-100 text-black px-4 pt-6 md:px-10 md:pt-10 lg:px-20 lg:pt-12 xl:px-30 xl:pt-15">
            <h1 className='text-3xl text-[#2E2B82] font-semibold leading-tight'>Empreendedorismos Incubados</h1>
            <div className="w-[120px] border-t-3 border-[#2E2B82] mt-4"></div>
            <p className='mt-4'>
              Explore os empreendimentos inovadores que estão sendo desenvolvidos em nosso programa de aceleração,
              <br />prontos para o crescimento futuro.
            </p>
            <h2 className='text-lg leading-tight mt-10 text-slate-400'>Nenhum empreendimento incubado.</h2>

            <h1 className='text-3xl text-[#2E2B82] font-semibold leading-tight mt-15'>Empreendedorismos Formados</h1>
            <div className="w-[120px] border-t-3 border-[#2E2B82] mt-4"></div>
            <p className='mt-4'>
              Descubra startups de sucesso que se formaram em nosso programa e agora estão prosperando no mercado.
            </p>
            <h2 className='text-lg leading-tight mt-10 text-slate-400'>Nenhum empreendimento incubado.</h2>
          </div>
        );
    }

    const filterByType = (type: string) => entrepreneurship.filter(item => item.type === type);

    const renderCards = (items: EntrepreneurshipItem[]) => (
        items.map(item => (
        <div key={item.id} className="min-w-[280px] flex-shrink-0 bg-white shadow-md rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300">
            <img 
            src={item.image_path || '/assets/logo.png'}
            alt={item.title}
            className="w-full h-40 object-cover"
            />
            <div className="p-4">
            <h3 className="text-lg font-semibold text-[#2E2B82]">
                {item.title}
            </h3>
            <p className="text-gray-600 text-sm mt-1">
                {item.description}
            </p>
            <span className="mt-3 inline-block border border-[#2E2B82] text-[#2E2B82] text-xs font-medium px-2 py-1 rounded-full w-fit mr-2">
                {item.tag}
            </span>
            <Link
                href={`/entrepreneurship/${item.id}`}
                className="mt-4 w-full border border-[#2E2B82] text-[#2E2B82] py-2 rounded-lg text-sm font-medium hover:bg-[#2E2B82] hover:text-white transition flex justify-center"
            >
                Abrir detalhes
            </Link>
            </div>
        </div>
        ))
    );

    return (
    <div className="flex flex-col min-h-screen bg-cover bg-center bg-gray-100 text-black px-4 pt-6 md:px-10 md:pt-10 lg:px-20 lg:pt-12 xl:px-30 xl:pt-15">
      
      <h1 className='text-3xl text-[#2E2B82] font-semibold leading-tight'>Empreendedorismos Incubados</h1>
      <div className="w-[120px] border-t-3 border-[#2E2B82] mt-4"></div>
      <p className='mt-4'>
        Explore os empreendimentos inovadores que estão sendo desenvolvidos em nosso programa de aceleração,
        <br />prontos para o crescimento futuro.
      </p>
      
      <div className="w-full md:w-[min(100%,600px)] [@media(min-width:1200px)]:w-[1000px] [@media(min-width:1600px)]:w-[1400px] overflow-x-auto pb-4 pr-6 scrollbar-thin scrollbar-thumb-gray-300 mt-10">
        <div className="flex gap-6">
          {renderCards(filterByType("INCUBADA"))}
        </div>
      </div>

      <h1 className='text-3xl text-[#2E2B82] font-semibold leading-tight mt-15'>Empreendedorismos Formados</h1>
      <div className="w-[120px] border-t-3 border-[#2E2B82] mt-4"></div>
      <p className='mt-4'>
        Descubra startups de sucesso que se formaram em nosso programa e agora estão prosperando no mercado.
      </p>
      
      <div className="w-full md:w-[min(100%,600px)] [@media(min-width:1200px)]:w-[1000px] [@media(min-width:1600px)]:w-[1400px] overflow-x-auto pb-4 pr-6 scrollbar-thin scrollbar-thumb-gray-300 mt-10">
        <div className="flex gap-6">
          {renderCards(filterByType("FORMADA"))}
        </div>
      </div>

    </div>
  );
}