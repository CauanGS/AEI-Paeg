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
    <div className="bg-gray-50 py-12">
      <div className="container mx-auto max-w-3xl p-6 bg-white shadow-lg rounded-lg">

        <h1 className="text-4xl font-bold text-[#2E2B82] text-center mb-8">Criar Novo Evento</h1>

        {error && (
          <p className="text-red-600 text-sm text-center">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Título</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Título do evento"
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#2E2B82] focus:border-[#2E2B82] text-gray-900 bg-white"
              required
            />
          </div>

          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">Data e Hora</label>
            <input
              type="datetime-local"
              id="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#2E2B82] focus:border-[#2E2B82] text-gray-900 bg-white"
            />
          </div>

          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">Local</label>
            <input
              type="text"
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Local do evento"
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#2E2B82] focus:border-[#2E2B82] text-gray-900 bg-white"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Descrição Curta</label>
            <textarea
              id="description"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descrição breve do evento (para exibição em cards)"
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#2E2B82] focus:border-[#2E2B82] text-gray-900 bg-white"
            />
          </div>

          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">Conteúdo</label>
            <TinyEditor onEditorChange={(newContent) => setContent(newContent)} />
          </div>

          <div>
            <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">Imagem do Evento (Opcional)</label>
            <input
              type="file"
              id="image"
              accept="image/png, image/jpeg, image/gif"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-[#e0e7ff] file:text-[#2E2B82] hover:file:bg-[#c7d2fe]"
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full bg-[#2E2B82] text-white px-6 py-3 rounded-md text-lg font-bold hover:bg-[#292570] transition duration-200 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isLoading ? 'Criando...' : 'Criar Evento'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
