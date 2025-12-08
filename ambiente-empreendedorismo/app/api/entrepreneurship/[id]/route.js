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

    const entrepreneurshipItem = await prisma.entrepreneurship.findUnique({
      where: {
        id: numericId,
      },
    });

    if (!entrepreneurshipItem) {
      return NextResponse.json(
        { error: "Empreendimento não encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(entrepreneurshipItem, { status: 200 });

  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Erro ao buscar empreendimento" },
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
    const type = data.get('type'); 
    const tag = data.get('tag');

    if (!title || !description || !content || !type || !tag) {
      return NextResponse.json(
        { error: "Todos os campos são obrigatórios." },
        { status: 400 }
      );
    }

    const existingEntrepreneurship = await prisma.entrepreneurship.findUnique({
      where: { id: numericId },
      select: { image_path: true }
    });
    
    if (!existingEntrepreneurship) {
      return NextResponse.json({ error: "Empreendimento não encontrado" }, { status: 404 });
    }
    oldImagePath = existingEntrepreneurship.image_path;

    if (file && file.size > 0) {
      try {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'entrepreneurship');
        await fs.promises.mkdir(uploadDir, { recursive: true });

        const fileName = `${Date.now()}_${file.name}`;
        const filePath = path.join(uploadDir, fileName);
        await fs.promises.writeFile(filePath, buffer);

        dbPath = `/uploads/entrepreneurship/${fileName}`;

      } catch (uploadError) {
        console.error("Erro ao fazer upload:", uploadError);
        return NextResponse.json({ error: "Erro ao processar a imagem." }, { status: 500 });
      }
    }

    const dataToUpdate = {
      title,
      description,
      content,
      type,
      tag
    };

    if (dbPath !== undefined) {
      dataToUpdate.image_path = dbPath;
    }

    const updatedEntrepreneurship = await prisma.entrepreneurship.update({
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

    return NextResponse.json(updatedEntrepreneurship, { status: 200 });

  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Erro ao atualizar empreendimento" }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const numericId = getIdFromRequest(request);

    if (numericId === null) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 });
    }

    const existingEntrepreneurship = await prisma.entrepreneurship.findUnique({
      where: { id: numericId },
      select: { image_path: true }
    });

    if (!existingEntrepreneurship) {
      return NextResponse.json({ error: "Empreendimento não encontrado" }, { status: 404 });
    }

    await prisma.entrepreneurship.delete({
      where: { id: numericId },
    });

    if (existingEntrepreneurship.image_path) {
      try {
        const filePath = path.join(process.cwd(), 'public', existingEntrepreneurship.image_path);
        if (fs.existsSync(filePath)) {
          await fs.promises.unlink(filePath);
        }
      } catch (deleteError) {
        console.error("Erro ao deletar imagem:", deleteError);
      }
    }

    return NextResponse.json({ message: "Empreendimento deletado com sucesso" }, { status: 200 });

  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Erro ao deletar empreendimento" }, { status: 500 });
  }
}