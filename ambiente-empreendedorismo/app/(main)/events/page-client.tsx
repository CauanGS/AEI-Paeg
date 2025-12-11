"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { CalendarIcon, MapPinIcon } from '@heroicons/react/24/outline'; // npm install @heroicons/react

interface EventItem {
  id: number;
  title: string;
  description: string;
  date: string;
  location: string;
  image_path: string | null;
}

export default function EventsPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/api/events')
      .then(res => res.json())
      .then(data => {
        setEvents(data);
        setIsLoading(false);
      })
      .catch(err => console.error(err));
  }, []);

  if (isLoading) return <div className="text-center p-10">Carregando eventos...</div>;

  return (
    <div className="bg-gray-50 py-12 min-h-screen">
      <div className="container mx-auto max-w-6xl p-6">
        <h1 className="text-4xl font-bold text-[#2E2B82] text-center mb-10">Próximos Eventos</h1>

        {events.length === 0 ? (
          <p className="text-center text-gray-500">Nenhum evento agendado no momento.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event) => (
              <div key={event.id} className="bg-white shadow-lg rounded-xl overflow-hidden flex flex-col hover:shadow-2xl transition duration-300">
                {/* Imagem com Data Sobreposta */}
                <div className="relative h-48 w-full bg-gray-200">
                  <img
                    src={event.image_path || '/assets/logo.png'}
                    alt={event.title}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-lg text-center shadow-sm">
                    <p className="text-xs font-bold text-gray-500 uppercase">
                      {new Date(event.date).toLocaleDateString('pt-BR', { month: 'short' })}
                    </p>
                    <p className="text-xl font-bold text-[#2E2B82]">
                      {new Date(event.date).getDate()}
                    </p>
                  </div>
                </div>

                <div className="p-6 flex-grow flex flex-col">
                  <h2 className="text-xl font-bold text-gray-800 mb-3">{event.title}</h2>
                  
                  {/* Info Local e Data */}
                  <div className="flex items-center text-gray-500 text-sm mb-2">
                    <CalendarIcon className="w-4 h-4 mr-2" />
                    {new Date(event.date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                  </div>
                  <div className="flex items-center text-gray-500 text-sm mb-4">
                    <MapPinIcon className="w-4 h-4 mr-2" />
                    {event.location}
                  </div>

                  <p className="text-gray-600 text-sm mb-4 flex-grow line-clamp-3">
                    {event.description}
                  </p>
                  
                  <Link 
                    href={`/events/${event.id}`} // Você precisará criar essa página depois
                    className="block text-center w-full py-2 border-2 border-[#2E2B82] text-[#2E2B82] font-bold rounded-lg hover:bg-[#2E2B82] hover:text-white transition"
                  >
                    Ver Detalhes
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}