"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';

const TinyEditor = dynamic(() => import('@/components/TinyEditor'), {
  ssr: false,
  loading: () => <p>Carregando editor...</p>
});

export default function CreateEventPage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('');
  const [file, setFile] = useState<File | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (!title || !description || !content || !location || !date) {
      setError('Todos os campos são obrigatórios');
      setIsLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('content', content);
    formData.append('location', location);
    formData.append('date', date);

    if (file) {
      formData.append('image', file);
    }

    try {
      const response = await fetch('/api/events', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Falha ao criar evento');
      }

      alert('Evento criado com sucesso!');
      router.push('/events');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-white">
      <div className="container mx-auto p-8 max-w-2xl">
        <h1 className="text-3xl font-bold text-[#2E2B82] mb-8">Criar Novo Evento</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-lg p-8">
        {/* Título */}
        <div className="mb-6">
          <label className="block text-black font-semibold mb-2">Título *</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Título do evento"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-[#2E2B82]"
            required
          />
        </div>

        {/* Data */}
        <div className="mb-6">
          <label className="block text-black font-semibold mb-2">Data e Hora *</label>
          <input
            type="datetime-local"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-[#2E2B82]"
            required
          />
        </div>

        {/* Local */}
        <div className="mb-6">
          <label className="block text-black font-semibold mb-2">Local *</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Local do evento"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-[#2E2B82]"
            required
          />
        </div>

        {/* Descrição Curta */}
        <div className="mb-6">
          <label className="block text-black font-semibold mb-2">Descrição Curta *</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Descrição breve do evento (para exibição em cards)"
            rows={3}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-[#2E2B82]"
            required
          />
        </div>

        {/* Conteúdo Completo com Editor */}
        <div className="mb-6">
          <label className="block text-black font-semibold mb-2">Conteúdo Completo *</label>
          <TinyEditor value={content} onChange={setContent} />
        </div>

        {/* Upload de Imagem */}
        <div className="mb-6">
          <label className="block text-black font-semibold mb-2">Imagem do Evento</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2"
          />
        </div>

        {/* Botões */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 bg-[#2E2B82] text-white font-bold py-2 rounded-lg hover:bg-[#1f1c5a] disabled:opacity-50"
          >
            {isLoading ? 'Criando...' : 'Criar Evento'}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="flex-1 bg-gray-300 text-gray-700 font-bold py-2 rounded-lg hover:bg-gray-400"
          >
            Cancelar
          </button>
        </div>
      </form>
      </div>
    </div>
  );
}
