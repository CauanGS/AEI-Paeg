"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';

interface ProgramItem {
  id: number;
  title: string;
  description: string;
  image_path: string | null;
}

export default function ProgramsPage() {
  const [programs, setPrograms] = useState<ProgramItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/api/programs')
      .then(res => res.json())
      .then(data => {
        setPrograms(data);
        setIsLoading(false);
      })
      .catch(err => console.error(err));
  }, []);

  if (isLoading) return <div className="text-center p-10">Carregando programas...</div>;

  return (
    <div className="bg-gray-50 text-gray-800 py-16 min-h-screen">
      <div className="container mx-auto max-w-6xl p-6">
        <h1 className="text-4xl font-bold text-[#2E2B82] text-center mb-8">Programas</h1>

        {programs.length === 0 ? (
          <p className="text-center text-slate-400">Nenhum programa cadastrado.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {programs.map((program) => (
              <article key={program.id} className="flex flex-col md:flex-row bg-white rounded-xl overflow-hidden shadow-sm transition border border-gray-200">
                <div className="p-6 md:w-3/5 flex flex-col justify-between">
                  <div>
                    <h2 className="text-2xl font-semibold text-gray-900 mb-2">{program.title}</h2>
                    <p className="text-gray-600 mb-4 line-clamp-4">{program.description}</p>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <Link href={`/programs/${program.id}`} className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition">Ver Detalhes</Link>
                    <span className="text-sm text-gray-500">Programa #{program.id}</span>
                  </div>
                </div>
                <div className="md:w-2/5 relative h-56 md:h-auto">
                  <img src={program.image_path || '/assets/logo.png'} alt={program.title} className="h-full w-full object-cover" />
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
