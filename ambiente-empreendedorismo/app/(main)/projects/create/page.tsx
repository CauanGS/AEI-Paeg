"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import useAuth from '@/hooks/useAuth';

const TinyEditor = dynamic(() => import('@/components/TinyEditor'), {
  ssr: false,
  loading: () => <p>Carregando editor...</p>
});

interface ProjectData {
  title: string;
  description: string;
  content: string;
  image_path: string | null;
  tags: string;
}

export default function CreateProjectPage() {
  const { loading, isLogged, role } = useAuth();
  const router = useRouter();
  const [allowed, setAllowed] = useState(false);

  const [formData, setFormData] = useState<ProjectData>({ title: '', description: '', content: '', image_path: null, tags: '' });
  const [file, setFile] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditorChange = (content: string) => {
    setFormData((prev) => ({ ...prev, content }));
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
    data.append('tags', formData.tags);
    if (file) data.append('image', file);

    try {
      const response = await fetch('/api/projects', { method: 'POST', body: data });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Falha ao criar projeto');
      }
      alert('Criado com sucesso');
      router.push('/projects');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  if (!allowed) {
    return <div className="container mx-auto p-8 text-center">Verificando permissões...</div>;
  }

  return (
    <div className="bg-gray-50 py-12">
      <div className="container mx-auto max-w-3xl p-6 bg-white shadow-lg rounded-lg text-gray-900">
        <h1 className="text-4xl font-bold text-[#2E2B82] text-center mb-8">Criar Projeto</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Título</label>
            <input id="title" name="title" value={formData.title} onChange={handleInputChange} placeholder="Título do projeto" className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#2E2B82] focus:border-[#2E2B82] text-gray-900 bg-white" required />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Descrição Curta</label>
            <textarea id="description" name="description" rows={3} value={formData.description} onChange={handleInputChange} placeholder="Descrição breve do projeto (para exibição em cards)" className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#2E2B82] focus:border-[#2E2B82] text-gray-900 bg-white" required />
          </div>

          <div>
            <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">Tags (Categorias)</label>
            <input id="tags" name="tags" value={formData.tags} onChange={handleInputChange} placeholder="Ex: Design, Educação" className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#2E2B82] focus:border-[#2E2B82] text-gray-900 bg-white" />
            <p className="text-xs text-gray-500 mt-1">Separe as categorias utilizando vírgulas.</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Conteúdo</label>
            <TinyEditor value={formData.content} onEditorChange={handleEditorChange} />
          </div>

          <div>
            <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">Imagem (Opcional)</label>
            <input type="file" id="image" accept="image/png, image/jpeg, image/gif" onChange={handleFileChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-[#e0e7ff] file:text-[#2E2B82] hover:file:bg-[#c7d2fe]" />
            <p className="text-xs text-gray-500 mt-1">Selecione uma imagem para o projeto (opcional).</p>
          </div>

          {error && <p className="text-red-600 text-sm text-center">{error}</p>}

          <div className="flex flex-col md:flex-row gap-4">
            <button type="submit" disabled={isSaving} className={`w-full bg-[#2E2B82] text-white px-6 py-3 rounded-md text-lg font-bold hover:bg-[#292570] transition duration-200 ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}`}>{isSaving ? 'Salvando...' : 'Criar'}</button>
            <button type="button" onClick={() => router.back()} className="w-full md:w-auto bg-gray-300 text-gray-700 px-6 py-3 rounded-md text-lg font-bold hover:bg-gray-200 transition">Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  );
}