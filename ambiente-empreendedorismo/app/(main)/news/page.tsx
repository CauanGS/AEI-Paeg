"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface NewsItem {
  id: number;
  title: string;
  description: string;
  image_path: string | null;
  created_at: string;
}

export default function NewsPage() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch('/api/news');
        const data = await response.json();
        setNews(data);
      } catch (error) {
        console.error("Falha ao buscar notícias:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNews();
  }, []);

  if (isLoading) {
    return (
      <div className="container mx-auto p-8 text-center">
        Carregando notícias...
      </div>
    );
  }

  if (news.length === 0) {
    return (
      <div className="container mx-auto p-8 text-center">
        Nenhuma notícia encontrada.
      </div>
    );
  }

  const featuredNews = news[0];
  const recentNews = news.slice(1, 5);
  const moreNews = news.slice(5);

  return (
    <div className="bg-gray-50 py-12">
      <div className="container mx-auto max-w-6xl p-6">
        
        <h1 className="text-4xl font-bold text-[#2E2B82] text-center mb-10">
          Notícias e Atualizações
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mb-12">
          
          <div className="lg:col-span-2">
            <div 
              key={featuredNews.id} 
              className="bg-white shadow-lg rounded-lg overflow-hidden flex flex-col h-full"
            >
              <div className="relative h-96 w-full bg-gray-200">
                <img
                  src={featuredNews.image_path || '/assets/logo.png'}
                  alt={featuredNews.title}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="p-8 flex-grow flex flex-col">
                <h2 className="text-3xl font-bold text-gray-800 mb-3">{featuredNews.title}</h2>
                <p className="text-gray-600 text-base mb-4 flex-grow">
                  {featuredNews.description}
                </p>
                <Link 
                  href={`/news/${featuredNews.id}`}
                  className="text-[#2E2B82] font-semibold hover:underline mt-4 self-start text-lg"
                >
                  Leia mais &rarr;
                </Link>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1 flex flex-col gap-6">
            
            {recentNews.length > 0 && (
              <h3 className="text-2xl font-bold text-gray-800">
                Recentes
              </h3>
            )}
            
            {recentNews.map((item) => (
              <div 
                key={item.id}
                className="bg-white shadow-lg rounded-lg overflow-hidden flex"
              >
                <div className="relative w-32 h-24 flex-shrink-0 bg-gray-200">
                  <img
                    src={item.image_path || '/assets/logo.png'}
                    alt={item.title}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="p-4 flex flex-col justify-center">
                  <h3 className="text-md font-bold text-gray-800 mb-1 line-clamp-2">
                    {item.title}
                  </h3>
                  <Link 
                    href={`/news/${item.id}`}
                    className="text-[#2E2B82] font-semibold hover:underline text-sm"
                  >
                    Leia mais &rarr;
                  </Link>
                </div>
              </div>
            ))}
          </div>

        </div>

        {moreNews.length > 0 && (
          <section>
            <h2 className="text-3xl font-bold text-gray-800 mb-6 pt-6 border-t border-gray-200">
              Mais Notícias
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {moreNews.map((item) => (
                <div 
                  key={item.id} 
                  className="bg-white shadow-lg rounded-lg overflow-hidden flex flex-col"
                >
                  <div className="relative h-48 w-full bg-gray-200">
                    <img
                      src={item.image_path || '/assets/logo.png'}
                      alt={item.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="p-6 flex-grow flex flex-col">
                    <h2 className="text-xl font-bold text-gray-800 mb-2">{item.title}</h2>
                    <p className="text-gray-600 text-sm mb-4 flex-grow">
                      {item.description}
                    </p>
                    <Link 
                      href={`/news/${item.id}`}
                      className="text-[#2E2B82] font-semibold hover:underline mt-4 self-start"
                    >
                      Leia mais &rarr;
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
        
      </div>
    </div>
  );
}