"use client";

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import useAuth from "@/hooks/useAuth";

const TinyEditor = dynamic(() => import('@/components/TinyEditor'), {
  ssr: false,
  loading: () => <p>Carregando editor...</p>
});

interface EntrepreneurshipData {
  title: string;
  description: string;
  content: string;
  type: string;
  tag: string;
  image_path: string | null;
}

export default function EditEntrepreneurshipPage() {
  const { loading, isLogged, role } = useAuth();
  const router = useRouter();
  const params = useParams();
  const { id } = params;

  const [formData, setFormData] = useState<EntrepreneurshipData>({
    title: '',
    description: '',
    content: '',
    type: '',
    tag: '',
    image_path: null,
  });
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [allowed, setAllowed] = useState<boolean | null>(null);

  const incubadaTags = ["Pré-incubação","Incubação","Pós-incubação"];
  const formadaTags = ["Abertura","Crescimento","Maturidade","Transição"];

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
    if (!allowed || !id) return;

    const fetchEntrepreneurship = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/entrepreneurship/${id}`);
        if (!response.ok) throw new Error('Falha ao buscar dados do empreendimento.');
        const data = await response.json();
        setFormData({
          title: data.title,
          description: data.description,
          content: data.content,
          type: data.type,
          tag: data.tag,
          image_path: data.image_path,
        });
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchEntrepreneurship();
  }, [allowed, id]);

  if (loading || allowed === null || isLoading) {
    return <div className="container mx-auto p-8 text-center">Carregando dados...</div>;
  }

  if (!allowed) return null;

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
    data.append('type', formData.type);
    data.append('tag', formData.tag);
    if (file) data.append('image', file);

    try {
      const response = await fetch(`/api/entrepreneurship/${id}`, {
        method: 'PUT',
        body: data,
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Falha ao atualizar empreendimento");
      }
      alert('Empreendimento atualizado com sucesso!');
      router.push('/entrepreneurship');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Tem certeza que deseja deletar esse empreendimento?')) return;

    setIsSaving(true);
    setError(null);
    try {
      const response = await fetch(`/api/entrepreneurship/${id}`, { method: 'DELETE' });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Falha ao deletar empreendimento");
      }
      alert('Empreendimento deletado com sucesso!');
      router.push('/entrepreneurship');
    } catch (err: any) {
      setError(err.message);
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-gray-50 py-12">
      <div className="container mx-auto max-w-3xl p-6 bg-white shadow-lg rounded-lg">
        <h1 className="text-4xl font-bold text-[#2E2B82] text-center mb-8">
          Editar Empreendimento
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Conteúdo</label>
            <TinyEditor value={formData.content} onEditorChange={handleEditorChange} />
          </div>

          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">Tipo de Empreendimento</label>
            <select
              id="type"
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value, tag: "" })}
              className="text-black w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#2E2B82] focus:border-[#2E2B82]"
              required
            >
              <option value="">Selecione...</option>
              <option value="INCUBADA">Incubada</option>
              <option value="FORMADA">Formada</option>
            </select>
          </div>

          <div>
            <label htmlFor="tag" className="block text-sm font-medium text-gray-700 mb-1">Estágio (Tag)</label>
            <select
              id="tag"
              value={formData.tag}
              onChange={(e) => setFormData({ ...formData, tag: e.target.value })}
              disabled={!formData.type}
              className={`text-black w-full px-4 py-2 border rounded-md shadow-sm
                ${!formData.type ? "bg-gray-200 cursor-not-allowed" : "border-gray-300 focus:ring-[#2E2B82] focus:border-[#2E2B82]"}`}
              required
            >
              <option value="">Selecione uma tag...</option>
              {formData.type === "INCUBADA" && incubadaTags.map(t => <option key={t} value={t}>{t}</option>)}
              {formData.type === "FORMADA" && formadaTags.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

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