"use client";

import { useState, useEffect } from 'react';
import { useRouter, notFound } from 'next/navigation';
import dynamic from 'next/dynamic';
import useAuth from "@/hooks/useAuth";


const TinyEditor = dynamic(() => import('@/components/TinyEditor'), {
  ssr: false,
  loading: () => <p>Carregando editor...</p>
});

export default function CreateEntrepreneurshipPage() {
  const { loading, isLogged, role } = useAuth();
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [type, setType] = useState('');
  const [tag, setTag] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const incubadaTags = ["Pré-incubação", "Incubação", "Pós-incubação"];
  const formadaTags = ["Abertura", "Crescimento", "Maturidade", "Transição"];
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

  if (loading || allowed === null) {
    return (
      <div className="py-20 text-center text-lg text-gray-600 bg-gray-50 min-h-screen"></div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (!title.trim() || !description.trim() || !content.trim()) {
      setError("Todos os campos são obrigatórios.");
      setIsLoading(false);
      return;
    }
    if (!type) {
      setError("Selecione o tipo (incubada / formada).");
      setIsLoading(false);
      return;
    }
    if (!tag) {
      setError("Selecione uma tag.");
      setIsLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('content', content);
    formData.append('tag', tag);
    formData.append('type', type);
    if (file) formData.append('image', file);

    try {
      const response = await fetch('/api/entrepreneurship', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Falha ao criar empreendimento");
      }

      alert('Empreendimento criado com sucesso!');
      router.push('/entrepreneurship');
    } catch (err: any) {
      console.error(err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 py-12">
      <div className="container mx-auto max-w-3xl p-6 bg-white shadow-lg rounded-lg">
        <h1 className="text-4xl font-bold text-[#2E2B82] text-center mb-8">
          Criar Empreendimento
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-black w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#2E2B82] focus:border-[#2E2B82]"
              placeholder="Título do empreendimento"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Descrição Curta</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="text-black w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#2E2B82] focus:border-[#2E2B82]"
              placeholder="Descrição breve"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Conteúdo</label>
            <TinyEditor value={content} onEditorChange={setContent} />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Empreendimento</label>
            <select
              value={type}
              onChange={(e) => {
                setType(e.target.value);
                setTag("");
              }}
              className="text-black w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#2E2B82] focus:border-[#2E2B82]"
              required
            >
              <option value="">Selecione...</option>
              <option value="INCUBADA">Incubada</option>
              <option value="FORMADA">Formada</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Estágio (Tag)</label>
            <select
              value={tag}
              onChange={(e) => setTag(e.target.value)}
              disabled={!type}
              className={`text-black w-full px-4 py-2 border rounded-md shadow-sm
                ${!type ? "bg-gray-200 cursor-not-allowed" : "border-gray-300 focus:ring-[#2E2B82] focus:border-[#2E2B82]"}`}
              required
            >
              <option value="">Selecione uma tag...</option>
              {type === "INCUBADA" && incubadaTags.map((t) => <option key={t} value={t}>{t}</option>)}
              {type === "FORMADA" && formadaTags.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Imagem (Opcional)</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="text-black w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-[#e0e7ff] file:text-[#2E2B82] hover:file:bg-[#c7d2fe]"
            />
          </div>

          {error && <p className="text-red-600 text-sm text-center">{error}</p>}

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full bg-[#2E2B82] text-white px-6 py-3 rounded-md text-lg font-bold hover:bg-[#292570] transition ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isLoading ? 'Salvando...' : 'Salvar Empreendimento'}
          </button>
        </form>
      </div>
    </div>
  );
}
