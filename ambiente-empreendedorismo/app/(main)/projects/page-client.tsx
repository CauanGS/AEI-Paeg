"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';

interface ProjectItem {
  id: number;
  title: string;
  description: string;
  image_path: string | null;
  tags: string | null;
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/api/projects')
      .then(res => res.json())
      .then(data => {
        setProjects(data);
        setIsLoading(false);
      })
      .catch(err => console.error(err));
  }, []);

  if (isLoading) return <div className="py-20 text-center text-lg text-gray-600 bg-gray-50 min-h-screen"></div>;

  return (
    <div className="bg-gradient-to-br from-white to-sky-50 py-16 min-h-screen">
      <div className="container mx-auto max-w-6xl p-6">
        <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#2E2B82] to-indigo-500 text-center mb-4">Nossos Projetos</h1>
        <p className="text-center text-gray-600 mb-4 max-w-2xl mx-auto">Coleção de projetos desenvolvidos com foco em impacto social, educação e comunidade.</p>

        {projects.length === 0 ? (
          <p className="text-center text-gray-500">Nenhum projeto cadastrado.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.map((project) => (
              <article key={project.id} className="bg-white ring-1 ring-indigo-50 hover:scale-[1.01] transform transition duration-200 rounded-2xl overflow-hidden shadow-sm flex flex-col md:flex-row items-stretch">
                <div className="md:w-1/3 relative h-48 md:h-auto">
                  <img src={project.image_path || '/assets/logo.png'} alt={project.title} className="h-full w-full object-cover rounded-md" />
                  <span className="absolute top-3 right-3 bg-white/95 text-indigo-700 text-xs px-3 py-1 rounded-md backdrop-blur">Projeto</span>
                </div>
                <div className="p-6 md:w-2/3 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">{project.title}</h3>
                    <p className="text-gray-600 text-sm mb-2 line-clamp-4">{project.description}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {project.tags ? (
                      project.tags.split(',').map((tag, index) => (
                        <span key={index} className="text-xs bg-indigo-50 text-indigo-700 px-2 py-1 rounded">
                          {tag.trim()}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">Geral</span>
                    )}
                  </div>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <Link href={`/projects/${project.id}`} className="px-4 py-2 border border-indigo-600 text-indigo-600 rounded-md font-semibold hover:bg-indigo-50 transition">Ver Detalhes</Link>
                    <span className="text-sm text-gray-400 hidden md:inline">ID #{project.id}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}