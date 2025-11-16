// prisma/seed.mjs
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Dados de teste (10 notícias)
const newsData = [
  {
    title: 'Notícia Destaque 1: A Grande Inauguração',
    description: 'Descubra como foi o evento de inauguração do novo polo de tecnologia e inovação, que promete mudar o cenário local.',
    content: '<p>Este é o <strong>conteúdo completo</strong> da notícia destaque. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>',
    image_path: 'https://placehold.co/1200x800/2E2B82/ffffff?text=Destaque+1',
  },
  {
    title: 'Notícia 2: Novas Parcerias Anunciadas',
    description: 'Conheça as 5 novas empresas que se juntaram ao nosso ecossistema de inovação.',
    content: '<p>O conteúdo da notícia 2 detalha as novas parcerias estratégicas. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>',
    image_path: 'https://placehold.co/800x600/555555/ffffff?text=Noticia+2',
  },
  {
    title: 'Notícia 3: Vencedores do Hackathon',
    description: 'Equipe "DevMasters" leva o prêmio principal com solução baseada em IA.',
    content: '<p>A competição foi acirrada, mas a equipe DevMasters surpreendeu os jurados. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>',
    image_path: 'https://placehold.co/800x600/555555/ffffff?text=Noticia+3',
  },
  {
    title: 'Notícia 4: Inscrições Abertas para Programa de Aceleração',
    description: 'Empreendedores têm até o final do mês para inscrever suas startups no programa "Acelera AEI".',
    content: '<p>Detalhes sobre o programa de aceleração e como se inscrever. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>',
    image_path: 'https://placehold.co/800x600/555555/ffffff?text=Noticia+4',
  },
  {
    title: 'Notícia 5: O Futuro do Empreendedorismo',
    description: 'Especialista fala sobre tendências para 2026.',
    content: '<p>Palestra inspiradora sobre as tendências do mercado. Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>',
    image_path: 'https://placehold.co/800x600/555555/ffffff?text=Noticia+5',
  },
  {
    title: 'Notícia 6: Workshop de Design Thinking',
    description: 'Veja como foi o workshop prático de Design Thinking.',
    content: '<p>Participantes colocaram a mão na massa. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>',
    image_path: 'https://placehold.co/800x600/555555/ffffff?text=Noticia+6',
  },
  {
    title: 'Notícia 7: Investimento Anjo',
    description: 'Startup local recebe aporte de R$ 500 mil.',
    content: '<p>Grande vitória para o ecossistema. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.</p>',
    image_path: 'https://placehold.co/800x600/555555/ffffff?text=Noticia+7',
  },
  {
    title: 'Notícia 8: AEI na Mídia',
    description: 'Portal de notícias nacional destaca o crescimento do polo.',
    content: '<p>Nosso trabalho sendo reconhecido. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore.</p>',
    image_path: 'https://placehold.co/800x600/555555/ffffff?text=Noticia+8',
  },
  {
    title: 'Notícia 9: Novo Laboratório Aberto',
    description: 'Conheça o novo laboratório de prototipagem rápida.',
    content: '<p>Equipamentos de ponta disponíveis para todos. Excepteur sint occaecat cupidatat non proident.</p>',
    image_path: 'https://placehold.co/800x600/555555/ffffff?text=Noticia+9',
  },
  {
    title: 'Notícia 10: Evento de Networking',
    description: 'Próxima edição do "Café com Empreendedores" já tem data marcada.',
    content: '<p>Não perca a chance de se conectar. Sunt in culpa qui officia deserunt mollit anim id est laborum.</p>',
    image_path: 'https://placehold.co/800x600/555555/ffffff?text=Noticia+10',
  },
];

async function main() {
  console.log('Iniciando script de ingestão...');
  
  // 1. Apaga todas as notícias antigas (para o script ser re-executável)
  console.log('Limpando notícias antigas...');
  await prisma.news.deleteMany({});

  // 2. Cria as 10 novas notícias
  console.log('Criando 10 novas notícias...');
  for (const item of newsData) {
    await prisma.news.create({
      data: item,
    });
  }
  
  console.log('Ingestão concluída com sucesso!');
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