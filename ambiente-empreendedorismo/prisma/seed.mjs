import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// --- DADOS DE NOTÍCIAS ---
const newsData = [
  {
    title: 'Parceria Internacional Confirmada',
    description: 'AEI firma acordo com polo de inovação no Vale do Silício para intercâmbio de startups.',
    content: '<p>Uma nova era para as nossas startups. O acordo prevê imersão de 3 meses para projetos selecionados.</p>',
    image_path: 'https://placehold.co/1200x800/2E2B82/ffffff?text=Parceria+Internacional',
  },
  {
    title: 'Edital de Incubação 2025',
    description: 'Estão abertas as inscrições para o novo ciclo de incubação de empresas de base tecnológica.',
    content: '<p>Procuramos soluções em Agritech, Healthtech e Edtech. Confira o edital completo no nosso portal.</p>',
    image_path: 'https://placehold.co/800x600/555555/ffffff?text=Edital+2025',
  },
  {
    title: 'Startup do AEI recebe aporte milionário',
    description: 'A "AgroSmart Solutions", incubada aqui, recebeu investimento série A de fundo de capital de risco.',
    content: '<p>O investimento será usado para expansão na América Latina. Um orgulho para nossa comunidade!</p>',
    image_path: 'https://placehold.co/800x600/2E2B82/ffffff?text=Investimento+Recebido',
  },
  {
    title: 'Novo Laboratório de IoT Inaugurado',
    description: 'Espaço conta com equipamentos de última geração para prototipagem de internet das coisas.',
    content: '<p>Disponível para todos os alunos e empreendedores vinculados ao AEI mediante agendamento.</p>',
    image_path: 'https://placehold.co/800x600/555555/ffffff?text=Laboratorio+IoT',
  },
  {
    title: 'Hackathon "Cidades Inteligentes" foi um sucesso',
    description: 'Mais de 100 participantes desenvolveram soluções para mobilidade urbana no último fim de semana.',
    content: '<p>A equipe vencedora criou um app para otimização de rotas de coleta seletiva.</p>',
    image_path: 'https://placehold.co/800x600/2E2B82/ffffff?text=Hackathon+Vencedores',
  },
  {
    title: 'Mentoria com CEO da TechGiant',
    description: 'Nossa rodada de mentorias trouxe grandes nomes do mercado para conversar com os incubados.',
    content: '<p>Troca de experiências valiosa sobre escala e gestão de times ágeis.</p>',
    image_path: 'https://placehold.co/800x600/555555/ffffff?text=Mentoria',
  },
];

// --- DADOS DE EVENTOS ---
const eventsData = [
  {
    title: 'Workshop: Pitch Perfeito',
    description: 'Aprenda a vender sua ideia para investidores em 3 minutos.',
    content: '<p>Técnicas de oratória e estruturação de pitch deck com especialistas.</p>',
    date: new Date('2025-11-20T14:00:00'), // Data futura
    location: 'Auditório Principal do AEI',
    image_path: 'https://placehold.co/1200x800/e67e22/ffffff?text=Workshop+Pitch',
  },
  {
    title: 'Café com Empreendedores',
    description: 'Networking informal para conectar fundadores e desenvolvedores.',
    content: '<p>Traga seu cartão de visitas e sua vontade de conectar. Café por nossa conta!</p>',
    date: new Date('2025-11-25T09:00:00'),
    location: 'Espaço de Convivência',
    image_path: 'https://placehold.co/1200x800/27ae60/ffffff?text=Networking',
  },
  {
    title: 'Palestra: Inteligência Artificial nos Negócios',
    description: 'Como a IA está transformando pequenas empresas e criando novas oportunidades.',
    content: '<p>Palestrante convidado: Dr. Alan Turing (Homenagem).',
    date: new Date('2025-12-05T19:00:00'),
    location: 'Auditório Azul',
    image_path: 'https://placehold.co/1200x800/8e44ad/ffffff?text=Palestra+IA',
  },
  {
    title: 'Demo Day 2025',
    description: 'O grande dia de apresentação das startups graduadas para o mercado.',
    content: '<p>Venha conhecer as próximas grandes inovações que nasceram aqui.</p>',
    date: new Date('2025-12-15T10:00:00'),
    location: 'Centro de Convenções',
    image_path: 'https://placehold.co/1200x800/c0392b/ffffff?text=Demo+Day',
  },
  {
    title: 'Curso de Modelagem de Negócios (Canvas)',
    description: 'Tire sua ideia do papel e estruture seu modelo de negócios.',
    content: '<p>Curso prático de 8 horas com certificação.</p>',
    date: new Date('2026-01-10T08:00:00'),
    location: 'Sala de Treinamento 1',
    image_path: 'https://placehold.co/1200x800/2980b9/ffffff?text=Curso+Canvas',
  },
];

async function main() {
  console.log('🌱 Iniciando script de ingestão...');
  
  // 1. Limpar dados antigos
  console.log('🧹 Limpando banco de dados...');
  await prisma.news.deleteMany({});
  await prisma.event.deleteMany({}); // Deleta eventos antigos também

  // 2. Criar Notícias
  console.log('📰 Criando Notícias...');
  for (const item of newsData) {
    await prisma.news.create({ data: item });
  }

  // 3. Criar Eventos
  console.log('📅 Criando Eventos...');
  for (const item of eventsData) {
    await prisma.event.create({ data: item });
  }
  
  console.log('✅ Ingestão concluída com sucesso!');
}

main()
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });