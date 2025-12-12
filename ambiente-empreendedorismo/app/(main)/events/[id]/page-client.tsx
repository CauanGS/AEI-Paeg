"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { CalendarIcon, MapPinIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

interface EventData {
  id: number;
  title: string;
  description: string;
  content: string;
  date: string;
  location: string;
  image_path: string | null;
}

export default function EventDetailsPage() {
  const [event, setEvent] = useState<EventData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const params = useParams();
  const { id } = params;

  useEffect(() => {
    if (id) {
      fetch(`/api/events/${id}`)
        .then(async (res) => {
          if (!res.ok) throw new Error('Evento não encontrado');
          return res.json();
        })
        .then((data) => {
          setEvent(data);
          setIsLoading(false);
        })
        .catch((err) => {
          setError(err.message);
          setIsLoading(false);
        });
    }
  }, [id]);

  if (isLoading) return <div className="py-20 text-center text-lg text-gray-600 bg-gray-50 min-h-screen"></div>;
  
  if (error || !event) {
    return (
      <div className="text-center p-10 bg-white min-h-[calc(100vh-85px)]">
        <h1 className="text-red-500 text-xl font-bold mb-2">Evento não encontrado</h1>
        <p className="text-gray-600">O evento que você procura pode ter sido removido, ter tido seu ID alterado ou <br /> estar temporariamente indisponível. Pedimos desculpas pelo inconveniente.</p>
        <Link 
          href="/events"
          className="block mt-4 w-40 mx-auto py-2 border-2 border-[#2E2B82] text-[#2E2B82] font-bold rounded-lg hover:bg-[#2E2B82] hover:text-white transition text-center"
        >
          Ver Eventos
        </Link>
      </div>
    );
  }

  const eventDate = new Date(event.date);

  return (
    <div className="bg-white py-12 min-h-screen">
      <div className="container mx-auto max-w-4xl p-6">
        
        <div className="mb-8 border-b pb-8 border-gray-100">
          <h1 className="text-4xl lg:text-5xl font-bold text-[#2E2B82] mb-6 leading-tight">
            {event.title}
          </h1>
          
          <div className="flex flex-col md:flex-row gap-4 md:gap-8 text-gray-600">
            <div className="flex items-center">
              <CalendarIcon className="w-6 h-6 mr-2 text-[#2E2B82]" />
              <span className="text-lg font-medium">
                {eventDate.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
                {' às '}
                {eventDate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
            <div className="flex items-center">
              <MapPinIcon className="w-6 h-6 mr-2 text-[#2E2B82]" />
              <span className="text-lg font-medium">{event.location}</span>
            </div>
          </div>
        </div>

        {/* Imagem Principal */}
        <div className="relative h-[400px] w-full bg-gray-100 rounded-2xl overflow-hidden mb-10 shadow-lg">
          <img
            src={event.image_path || '/assets/logo.png'}
            alt={event.title}
            className="h-full w-full object-cover"
          />
        </div>

        {/* Conteúdo Rico (HTML) */}
        {/* A classe 'prose' formata automaticamente o HTML do editor */}
        <div 
          className="prose prose-lg max-w-none text-gray-700 prose-headings:text-[#2E2B82] prose-a:text-blue-600"
          dangerouslySetInnerHTML={{ __html: event.content || event.description }} 
        />
        
      </div>
    </div>
  );
}