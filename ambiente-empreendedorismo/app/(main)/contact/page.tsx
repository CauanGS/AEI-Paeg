// app/contact/page.tsx
"use client"; // Necessário para usar o formulário, mesmo que ainda não envie

import { useState } from 'react';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  // Por enquanto, o envio não fará nada, 
  // já que o backend é responsabilidade do seu parceiro.
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Funcionalidade de envio de formulário ainda não implementada.');
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
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#2E2B82] focus:border-[#2E2B82]"
              required
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
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#2E2B82] focus:border-[#2E2B82]"
              required
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
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#2E2B82] focus:border-[#2E2B82]"
              required
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
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#2E2B82] focus:border-[#2E2B82]"
              required
            />
          </div>

          {/* Botão Enviar */}
          <div>
            <button
              type="submit"
              className="w-full bg-[#2E2B82] text-white px-6 py-3 rounded-md text-lg font-bold hover:bg-[#292570] transition duration-200"
            >
              Enviar Mensagem
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}