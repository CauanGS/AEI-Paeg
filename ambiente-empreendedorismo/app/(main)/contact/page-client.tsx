"use client";

import { useState } from 'react';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, subject, message }),
      });

      if (response.ok) {
        setStatus({ type: 'success', message: 'Mensagem enviada com sucesso! Entraremos em contato em breve.' });
        setName('');
        setEmail('');
        setSubject('');
        setMessage('');
      } else {
        const data = await response.json();
        setStatus({ type: 'error', message: data.error || 'Ocorreu um erro ao enviar a mensagem.' });
      }
    } catch (error) {
      setStatus({ type: 'error', message: 'Erro de conexão. Tente novamente mais tarde.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 py-12">
      <div className="container mx-auto max-w-2xl p-6 bg-white shadow-lg rounded-lg">
        
        <h1 className="text-4xl font-bold text-[#2E2B82] text-center mb-8">
          Entre em Contato
        </h1>
        
        <p className="text-center text-gray-600 mb-8">
          Tem alguma dúvida, sugestão ou proposta? Preencha o formulário abaixo.
        </p>

        {status && (
          <div className={`mb-6 p-4 rounded-md ${status.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {status.message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Campo Nome */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Nome Completo
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#2E2B82] focus:border-[#2E2B82] text-gray-700"
              required
              disabled={loading}
            />
          </div>

          {/* Campo Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#2E2B82] focus:border-[#2E2B82] text-gray-700"
              required
              disabled={loading}
            />
          </div>

          {/* Campo Assunto */}
          <div>
            <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
              Assunto
            </label>
            <input
              type="text"
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#2E2B82] focus:border-[#2E2B82] text-gray-700"
              required
              disabled={loading}
            />
          </div>

          {/* Campo Mensagem */}
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
              Mensagem
            </label>
            <textarea
              id="message"
              rows={5}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#2E2B82] focus:border-[#2E2B82] text-gray-700"
              required
              disabled={loading}
            />
          </div>

          {/* Botão Enviar */}
          <div>
            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-[#2E2B82] text-white px-6 py-3 rounded-md text-lg font-bold transition duration-200 ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-[#292570]'}`}
            >
              {loading ? 'Enviando...' : 'Enviar Mensagem'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}