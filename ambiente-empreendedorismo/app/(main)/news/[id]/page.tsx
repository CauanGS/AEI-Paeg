"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';

interface NewsItem {
  id: number;
  title: string;
  description: string;
  content: string;
  image_path: string | null;
  created_at: string;
}

export default function NewsItemPage() {
  const [newsItem, setNewsItem] = useState<NewsItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const params = useParams();
  const { id } = params;

  useEffect(() => {
    if (id) {
      const fetchNewsItem = async () => {
        try {
          const response = await fetch(`/api/news/${id}`);
          if (!response.ok) {
            throw new Error('Notícia não encontrada');
          }
          const data = await response.json();
          setNewsItem(data);
        } catch (err: any) {
          setError(err.message);
        } finally {
          setIsLoading(false);
        }
      };

      fetchNewsItem();
    }
  }, [id]);

  if (isLoading) {
    return (
      <div className="container mx-auto p-8 text-center">
        Carregando notícia...
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-8 text-center text-red-600">
        Erro: {error}
      </div>
    );
  }

  if (!newsItem) {
    return null;
  }

  return (
    <div className="bg-white py-12">
      <div className="container mx-auto max-w-4xl p-6">
        
        {/* Título */}
        <h1 className="text-4xl lg:text-5xl font-bold text-[#2E2B82] mb-6">
          {newsItem.title}
        </h1>

        {/* Imagem Principal */}
        {newsItem.image_path && (
          <div className="relative h-96 w-full bg-gray-200 rounded-lg overflow-hidden mb-8 shadow-lg">
            <img
              src={newsItem.image_path}
              alt={newsItem.title}
              className="h-full w-full object-cover"
            />
          </div>
        )}

        {}
        <div 
          className="prose lg:prose-xl max-w-none text-gray-700"
          dangerouslySetInnerHTML={{ __html: newsItem.content }} 
        />
        
      </div>
    </div>
  );
}