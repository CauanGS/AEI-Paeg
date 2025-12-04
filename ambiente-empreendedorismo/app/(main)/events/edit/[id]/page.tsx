"use client";

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import dynamic from 'next/dynamic';

const TinyEditor = dynamic(() => import('@/components/TinyEditor'), {
  ssr: false,
  loading: () => <p>Carregando editor...</p>
});

interface EventData {
  title: string;
  description: string;
  content: string;
  date: string;
  location: string;
  image_path: string | null;
}

export default function EditEventPage() {
  const [formData, setFormData] = useState<EventData>({
    title: '',
    description: '',
    content: '',
    date: '',
    location: '',
    image_path: null,
  });
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
  const params = useParams();
  const { id } = params;

  useEffect(() => {
    if (id) {
      const fetchEventData = async () => {
        try {
          setIsLoading(true);
          const response = await fetch(`/api/events/${id}`);
          if (!response.ok) {
            throw new Error('Falha ao buscar dados do evento.');
          }
          const data = await response.json();
          setFormData({
            title: data.title,
            description: data.description,
            content: data.content,
            date: new Date(data.date).toISOString().slice(0, 16),
            location: data.location,
            image_path: data.image_path,
          });
        } catch (err: any) {
          setError(err.message);
        } finally {
          setIsLoading(false);
        }
      };

      fetchEventData();
    }
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);

    if (!formData.title || !formData.description || !formData.content || !formData.date || !formData.location) {
      setError('Todos os campos são obrigatórios');
      setIsSaving(false);
      return;
    }

    const form = new FormData();
    form.append('title', formData.title);
    form.append('description', formData.description);
    form.append('content', formData.content);
    form.append('date', formData.date);
    form.append('location', formData.location);

    if (file) {
      form.append('image', file);
    }

    try {
      const response = await fetch(`/api/events/${id}`, {
        method: 'PUT',
        body: form,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Falha ao atualizar evento');
      }

      alert('Evento atualizado com sucesso!');
      router.push(`/events/${id}`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-white flex items-center justify-center">
        <div className="container mx-auto p-8 text-center text-black"> {/* Adicionado text-black aqui também */}
          Carregando dados do evento...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-white">
      <div className="container mx-auto p-8 max-w-2xl">
        <h1 className="text-3xl font-bold text-[#2E2B82] mb-8">Editar Evento</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-lg p-8">
        {/* Título */}
        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2">Título *</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Título do evento"
            // Adicionado text-black aqui
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-[#2E2B82] text-black"
            required
          />
        </div>

        {/* Data */}
        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2">Data e Hora *</label>
          <input
            type="datetime-local"
            name="date"
            value={formData.date}
            onChange={handleChange}
            // Adicionado text-black aqui
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-[#2E2B82] text-black"
            required
          />
        </div>

        {/* Local */}
        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2">Local *</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="Local do evento"
            // Adicionado text-black aqui
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-[#2E2B82] text-black"
            required
          />
        </div>

        {/* Descrição Curta */}
        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2">Descrição Curta *</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Descrição breve do evento"
            rows={3}
            // Adicionado text-black aqui
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-[#2E2B82] text-black"
            required
          />
        </div>

        {/* Conteúdo Completo com Editor */}
        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2">Conteúdo Completo *</label>
          <TinyEditor
            value={formData.content} // Certifique-se que seu TinyEditor aceita 'value' ou 'initialValue' corretamente
            onChange={(newContent) => setFormData((prev) => ({ ...prev, content: newContent }))}
          />
        </div>

        {/* Imagem Atual */}
        {formData.image_path && (
          <div className="mb-6">
            <p className="text-gray-700 font-semibold mb-2">Imagem Atual:</p>
            <img
              src={formData.image_path}
              alt="Imagem atual"
              className="h-40 w-40 object-cover rounded-lg mb-4"
            />
          </div>
        )}

        {/* Upload de Nova Imagem */}
        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2">Alterar Imagem</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-black" // Adicionado text-black
          />
        </div>

        {/* Botões */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={isSaving}
            className="flex-1 bg-[#2E2B82] text-white font-bold py-2 rounded-lg hover:bg-[#1f1c5a] disabled:opacity-50"
          >
            {isSaving ? 'Salvando...' : 'Salvar Alterações'}
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