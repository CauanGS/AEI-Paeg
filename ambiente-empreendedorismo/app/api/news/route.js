import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import path from "path";
import fs from "fs";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const news = await prisma.news.findMany({
      orderBy: {
        created_at: 'desc'
      }
    });
    return NextResponse.json(news, { status: 200 });

  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Erro ao buscar notícias" }, 
      { status: 500 }
    );
  }
}

export async function POST(request) {
  let dbPath = null;

  try {
    const data = await request.formData();
    
    const title = data.get('title');
    const description = data.get('description');
    const content = data.get('content');
    const file = data.get('image');

    if (!title || !description || !content) {
      return NextResponse.json(
        { error: "Título, descrição e conteúdo são obrigatórios." },
        { status: 400 }
      );
    }

    if (file && file.size > 0) {
      try {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'news');
        
        await fs.promises.mkdir(uploadDir, { recursive: true });

        const fileName = `${Date.now()}_${file.name}`;
        const filePath = path.join(uploadDir, fileName);

        await fs.promises.writeFile(filePath, buffer);

        dbPath = `/uploads/news/${fileName}`;
        
      } catch (uploadError) {
        console.error("Erro ao fazer upload do arquivo:", uploadError);
        return NextResponse.json(
          { error: "Erro ao processar a imagem." }, 
          { status: 500 }
        );
      }
    }

    const newNews = await prisma.news.create({
      data: {
        title: title,
        description: description,
        content: content,
        image_path: dbPath,
      },
    });

    return NextResponse.json(newNews, { status: 201 });

  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Erro ao criar notícia" }, 
      { status: 500 }
    );
  }
}