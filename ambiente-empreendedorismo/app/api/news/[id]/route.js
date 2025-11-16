import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// 1. Remova o 'context' da assinatura
export async function GET(request) {
  try {
    // 2. Obtenha a URL completa a partir do 'request'
    const url = new URL(request.url);
    
    // 3. Pegue a última parte do caminho (que é o ID)
    // Ex: /api/news/6 -> '6'
    const id = url.pathname.split('/').pop();

    // 4. Validar o ID
    const numericId = parseInt(id);
    if (isNaN(numericId)) {
      return NextResponse.json(
        { error: "ID inválido. O ID deve ser um número." },
        { status: 400 }
      );
    }

    // 5. Buscar no banco
    const newsItem = await prisma.news.findUnique({
      where: {
        id: numericId,
      },
    });

    if (!newsItem) {
      return NextResponse.json(
        { error: "Notícia não encontrada" },
        { status: 404 }
      );
    }

    return NextResponse.json(newsItem, { status: 200 });

  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Erro ao buscar notícia" },
      { status: 500 }
    );
  }
}