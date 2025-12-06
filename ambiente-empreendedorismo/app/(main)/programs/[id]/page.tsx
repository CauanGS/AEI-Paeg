"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';

export default function ProgramDetailsPage() {
  const [program, setProgram] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const params = useParams();
  const { id } = params;

  useEffect(() => {
    if (id) {
      fetch(`/api/programs/${id}`)
        .then(async (res) => { if (!res.ok) throw new Error('Programa não encontrado'); return res.json(); })
        .then(data => { setProgram(data); setIsLoading(false); })
        .catch(err => { setError(err.message); setIsLoading(false); });
    }
  }, [id]);

  if (isLoading) return <div className="text-center p-10">Carregando detalhes do programa...</div>;

  if (error || !program) {
    return (
      <div className="text-center p-10">
        <p className="text-red-500 text-xl font-bold mb-2">Ops!</p>
        <p className="text-gray-600">{error || "Programa não encontrado"}</p>
      </div>
    );
  }

  return (
    <div className="bg-white py-12 min-h-screen">
      <div className="container mx-auto max-w-4xl p-6">
        <div className="mb-8 border-b pb-8 border-gray-100">
          <h1 className="text-4xl lg:text-5xl font-bold text-[#2E2B82] mb-6 leading-tight">{program.title}</h1>
          <p className="text-gray-600">{program.description}</p>
        </div>

        <div className="relative h-[400px] w-full bg-gray-100 rounded-2xl overflow-hidden mb-10 shadow-lg">
          <img src={program.image_path || '/assets/logo.png'} alt={program.title} className="h-full w-full object-cover" />
        </div>

        <div className="prose prose-lg max-w-none text-gray-700 prose-headings:text-[#2E2B82] prose-a:text-blue-600" dangerouslySetInnerHTML={{ __html: program.content || program.description }} />
      </div>
    </div>
  );
}
