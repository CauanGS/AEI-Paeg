import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import path from "path";
import fs from "fs";

const prisma = new PrismaClient();

// Função auxiliar para pegar o ID
function getIdFromRequest(request) {
  const url = new URL(request.url);
  const id = url.pathname.split('/').pop();
  const numericId = parseInt(id);
  if (isNaN(numericId)) return null;
  return numericId;
}

// --- GET (Buscar Evento) ---
export async function GET(request) {
  try {
    const numericId = getIdFromRequest(request);
    if (numericId === null) return NextResponse.json({ error: "ID inválido" }, { status: 400 });

    const event = await prisma.event.findUnique({ where: { id: numericId } });
    if (!event) return NextResponse.json({ error: "Evento não encontrado" }, { status: 404 });

    return NextResponse.json(event, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Erro ao buscar evento" }, { status: 500 });
  }
}

// --- PUT (Atualizar Evento) ---
export async function PUT(request) {
  let dbPath = undefined;
  let oldImagePath = null;

  try {
    const numericId = getIdFromRequest(request);
    if (numericId === null) return NextResponse.json({ error: "ID inválido" }, { status: 400 });

    const data = await request.formData();
    const title = data.get('title');
    const description = data.get('description');
    const content = data.get('content');
    const dateStr = data.get('date');
    const location = data.get('location');
    const file = data.get('image');

    // Validação
    if (!title || !description || !content || !dateStr || !location) {
      return NextResponse.json({ error: "Campos obrigatórios faltando." }, { status: 400 });
    }

    // Busca evento existente para pegar a imagem antiga
    const existingEvent = await prisma.event.findUnique({
      where: { id: numericId },
      select: { image_path: true }
    });

    if (!existingEvent) return NextResponse.json({ error: "Evento não encontrado" }, { status: 404 });
    oldImagePath = existingEvent.image_path;

    // Upload da nova imagem (se houver)
    if (file && file.size > 0) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'events');
      await fs.promises.mkdir(uploadDir, { recursive: true });
      
      const fileName = `${Date.now()}_${file.name}`;
      const filePath = path.join(uploadDir, fileName);
      await fs.promises.writeFile(filePath, buffer);
      
      dbPath = `/uploads/events/${fileName}`;
    }

    // Prepara dados para atualização
    const dataToUpdate = {
      title,
      description,
      content,
      date: new Date(dateStr), // Converte a string de data para objeto Date
      location,
    };

    if (dbPath !== undefined) {
      dataToUpdate.image_path = dbPath;
    }

    // Atualiza no banco
    const updatedEvent = await prisma.event.update({
      where: { id: numericId },
      data: dataToUpdate,
    });

    // Deleta imagem antiga do disco se houver uma nova
    if (dbPath !== undefined && oldImagePath) {
      try {
        const oldFilePath = path.join(process.cwd(), 'public', oldImagePath);
        if (fs.existsSync(oldFilePath)) {
          await fs.promises.unlink(oldFilePath);
        }
      } catch (e) {
        console.error("Erro ao deletar imagem antiga:", e);
      }
    }

    return NextResponse.json(updatedEvent, { status: 200 });

  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Erro ao atualizar evento" }, { status: 500 });
  }
}

// --- DELETE (Apagar Evento) ---
export async function DELETE(request) {
  try {
    const numericId = getIdFromRequest(request);
    if (numericId === null) return NextResponse.json({ error: "ID inválido" }, { status: 400 });

    const existingEvent = await prisma.event.findUnique({
      where: { id: numericId },
      select: { image_path: true }
    });

    if (!existingEvent) return NextResponse.json({ error: "Evento não encontrado" }, { status: 404 });

    await prisma.event.delete({ where: { id: numericId } });

    // Apaga a imagem do disco
    if (existingEvent.image_path) {
      try {
        const filePath = path.join(process.cwd(), 'public', existingEvent.image_path);
        if (fs.existsSync(filePath)) {
          await fs.promises.unlink(filePath);
        }
      } catch (e) {
        console.error("Erro ao deletar imagem:", e);
      }
    }

    return NextResponse.json({ message: "Evento deletado" }, { status: 200 });

  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Erro ao deletar evento" }, { status: 500 });
  }
}