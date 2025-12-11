"use client";

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import useAuth from "@/hooks/useAuth";

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
  const { loading, isLogged, role } = useAuth();
  const router = useRouter();
  const params = useParams();
  const { id } = params;

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
  const [content, setContent] = useState('');
  const [allowed, setAllowed] = useState<boolean | null>(null);

  useEffect(() => {
    if (!loading) {
      if (!isLogged) {
        router.replace("/login");
        return;
      }
      if (role === "ADMIN") {
        setAllowed(true);
      } else {
        setAllowed(false);
        router.replace("/notfound");
      }
    }
  }, [loading, isLogged, role, router]);

  useEffect(() => {
    if (id && allowed) {
      const fetchEventData = async () => {
        try {
          setIsLoading(true);
          const response = await fetch(`/api/events/${id}`);
          if (!response.ok) throw new Error('Falha ao buscar dados do evento.');

          const data = await response.json();

          setFormData({
            title: data.title,
            description: data.description,
            content: data.content,
            date: new Date(data.date).toISOString().slice(0, 16),
            location: data.location,
            image_path: data.image_path,
          });
          setContent(data.content);
        } catch (err: any) {
          setError(err.message);
        } finally {
          setIsLoading(false);
        }
      };
      fetchEventData();
    }
  }, [id, allowed]);

  if (loading || allowed === null || !allowed) {
    return <div className="py-20 text-center text-lg text-gray-600">Verificando permissão...</div>;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEditorChange = (value: string) => {
    setContent(value);
    setFormData(prev => ({ ...prev, content: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files?.[0] || null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);

    const data = new FormData();
    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('content', formData.content);
    data.append('date', formData.date);
    data.append('location', formData.location);
    if (file) data.append('image', file);

    try {
      const response = await fetch(`/api/events/${id}`, { method: 'PUT', body: data });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Falha ao atualizar evento");
      }
      alert('Evento atualizado com sucesso!');
      router.push('/events');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Tem certeza que deseja deletar este evento? Esta ação não pode ser desfeita.')) return;
    setIsSaving(true);
    setError(null);

    try {
      const response = await fetch(`/api/events/${id}`, { method: 'DELETE' });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Falha ao deletar evento");
      }
      alert('Evento deletado com sucesso!');
      router.push('/events');
    } catch (err: any) {
      setError(err.message);
      setIsSaving(false);
    }
  };

  if (isLoading) return <div className="container mx-auto p-8 text-center">Carregando dados...</div>;

  return (
    <div className="bg-gray-50 py-12">
      <div className="container mx-auto max-w-3xl p-6 bg-white shadow-lg rounded-lg">

        <h1 className="text-4xl font-bold text-[#2E2B82] text-center mb-8">Editar Evento</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Título */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Título</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full text-black px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#2E2B82] focus:border-[#2E2B82]"
              required
            />
          </div>

          {/* Data e Local */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">Data e Hora</label>
              <input
                type="datetime-local"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                className="w-full text-black px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#2E2B82] focus:border-[#2E2B82]"
                required
              />
            </div>
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">Local</label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                className="w-full text-black px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#2E2B82] focus:border-[#2E2B82]"
                required
              />
            </div>
          </div>

          {/* Descrição */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Descrição Curta</label>
            <textarea
              id="description"
              name="description"
              rows={3}
              value={formData.description}
              onChange={handleInputChange}
              className="w-full text-black px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#2E2B82] focus:border-[#2E2B82]"
              required
            />
          </div>

          {/* Conteúdo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Conteúdo</label>
            <TinyEditor value={content} onEditorChange={handleEditorChange} />
          </div>

          {/* Imagem */}
          <div>
            <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">Alterar Imagem (Opcional)</label>
            {formData.image_path && !file && (
              <div className="my-2">
                <p className="text-sm text-gray-500 mb-1">Imagem atual:</p>
                <img src={formData.image_path} alt="Imagem atual" className="w-full h-auto max-h-60 object-cover rounded-md border" />
              </div>
            )}
            <input
              type="file"
              id="image"
              accept="image/png, image/jpeg, image/gif"
              onChange={handleFileChange}
              className="w-full text-black px-3 py-2 border border-gray-300 rounded-md shadow-sm file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-[#e0e7ff] file:text-[#2E2B82] hover:file:bg-[#c7d2fe]"
            />
            <p className="text-xs text-gray-500 mt-1">Selecione uma nova imagem apenas se desejar substituí-la.</p>
          </div>

          {error && <p className="text-red-600 text-sm text-center">{error}</p>}

          {/* Botões */}
          <div className="flex flex-col md:flex-row gap-4">
            <button
              type="submit"
              disabled={isSaving}
              className={`w-full bg-[#2E2B82] text-white px-6 py-3 rounded-md text-lg font-bold hover:bg-[#292570] transition duration-200 ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isSaving ? 'Salvando...' : 'Salvar Alterações'}
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={isSaving}
              className={`w-full md:w-auto bg-red-600 text-white px-6 py-3 rounded-md text-lg font-bold hover:bg-red-700 transition duration-200 ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              Deletar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
