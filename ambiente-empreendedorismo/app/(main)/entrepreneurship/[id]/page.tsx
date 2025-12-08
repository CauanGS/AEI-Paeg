"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';

interface EntrepreneurshipItem {
  id: number;
  title: string;
  description: string;
  content: string;
  type: string;
  tag: string;
  image_path: string | null;
  created_at: string;
}

export default function EntrepreneurshipItemPage() {
  const [entrepreneurshipItem, setEntrepreneurshipItem] = useState<EntrepreneurshipItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const params = useParams();
  const { id } = params;

  useEffect(() => {
    if (id) {
      const fetchEntrepreneurshipItem = async () => {
        try {
          const response = await fetch(`/api/entrepreneurship/${id}`);
          if (!response.ok) {
            throw new Error('Empreedimento não encontrado');
          }
          const data = await response.json();
          setEntrepreneurshipItem(data);
        } catch (err: any) {
          setError(err.message);
        } finally {
          setIsLoading(false);
        }
      };

      fetchEntrepreneurshipItem();
    }
  }, [id]);

  if (isLoading) {
    return (
      <div className="container mx-auto p-8 text-center">
        Carregando empreendimento...
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

  if (!entrepreneurshipItem) {
    return null;
  }

  return (
    <div className="bg-white min-h-[calc(100vh-85px)] pt-[40px] pb-12 overflow-x-hidden">
      <div className="container mx-auto max-w-4xl p-6">
        
        <h1 className="text-4xl lg:text-5xl font-bold text-[#2E2B82] mb-6">
          {entrepreneurshipItem.title}
        </h1>
        
        {entrepreneurshipItem.image_path && (
          <div className="relative h-96 w-full bg-gray-200 rounded-lg overflow-hidden mb-8 shadow-lg">
            <img
              src={entrepreneurshipItem.image_path}
              alt={entrepreneurshipItem.title}
              className="h-full w-full object-cover"
            />
          </div>
        )}

        {}
        <div 
          className="prose lg:prose-xl max-w-none text-gray-700"
          dangerouslySetInnerHTML={{ __html: entrepreneurshipItem.content }} 
        />
        
      </div>
    </div>
  );
}