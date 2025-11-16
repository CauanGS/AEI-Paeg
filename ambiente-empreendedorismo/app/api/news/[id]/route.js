import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import path from "path";
import fs from "fs";

const prisma = new PrismaClient();

function getIdFromRequest(request) {
  const url = new URL(request.url);
  const id = url.pathname.split('/').pop();
  
  const numericId = parseInt(id);
  if (isNaN(numericId)) {
    return null;
  }
  return numericId;
}

export async function GET(request) {
  try {
    const numericId = getIdFromRequest(request);

    if (numericId === null) {
      return NextResponse.json(
        { error: "ID inválido. O ID deve ser um número." },
        { status: 400 }
      );
    }

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

export async function PUT(request) {
  let dbPath = undefined;
  let oldImagePath = null;

  try {
    const numericId = getIdFromRequest(request);
    
    if (numericId === null) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 });
    }

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

    const existingNews = await prisma.news.findUnique({
      where: { id: numericId },
      select: { image_path: true }
    });
    
    if (!existingNews) {
      return NextResponse.json({ error: "Notícia não encontrada" }, { status: 404 });
    }
    oldImagePath = existingNews.image_path;

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
        console.error("Erro ao fazer upload:", uploadError);
        return NextResponse.json({ error: "Erro ao processar a imagem." }, { status: 500 });
      }
    }

    const dataToUpdate = {
      title,
      description,
      content,
    };

    if (dbPath !== undefined) {
      dataToUpdate.image_path = dbPath;
    }

    const updatedNews = await prisma.news.update({
      where: { id: numericId },
      data: dataToUpdate,
    });

    if (dbPath !== undefined && oldImagePath) {
      try {
        const oldFilePath = path.join(process.cwd(), 'public', oldImagePath);
        if (fs.existsSync(oldFilePath)) {
          await fs.promises.unlink(oldFilePath);
        }
      } catch (deleteError) {
        console.error("Erro ao deletar imagem antiga:", deleteError);
      }
    }

    return NextResponse.json(updatedNews, { status: 200 });

  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Erro ao atualizar notícia" }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const numericId = getIdFromRequest(request);

    if (numericId === null) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 });
    }

    const existingNews = await prisma.news.findUnique({
      where: { id: numericId },
      select: { image_path: true }
    });

    if (!existingNews) {
      return NextResponse.json({ error: "Notícia não encontrada" }, { status: 404 });
    }

    await prisma.news.delete({
      where: { id: numericId },
    });

    if (existingNews.image_path) {
      try {
        const filePath = path.join(process.cwd(), 'public', existingNews.image_path);
        if (fs.existsSync(filePath)) {
          await fs.promises.unlink(filePath);
        }
      } catch (deleteError) {
        console.error("Erro ao deletar imagem:", deleteError);
      }
    }

    return NextResponse.json({ message: "Notícia deletada com sucesso" }, { status: 200 });

  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Erro ao deletar notícia" }, { status: 500 });
  }
}