import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import path from "path";
import fs from "fs";

const prisma = new PrismaClient();

// GET: Listar Eventos
export async function GET() {
  try {
    const events = await prisma.event.findMany({
      orderBy: { date: 'asc' } // Ordena por data (mais próximo primeiro)
    });
    return NextResponse.json(events, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Erro ao buscar eventos" }, { status: 500 });
  }
}

// POST: Criar Evento (Igual notícias, mas com data e local)
export async function POST(request) {
  let dbPath = null;
  try {
    const data = await request.formData();
    
    // Campos
    const title = data.get('title');
    const description = data.get('description');
    const content = data.get('content');
    const dateStr = data.get('date'); // Vem como string do input datetime-local
    const location = data.get('location');
    const file = data.get('image');

    if (!title || !dateStr || !location) {
      return NextResponse.json({ error: "Campos obrigatórios faltando." }, { status: 400 });
    }

    // Upload de Imagem (código reutilizado de notícias)
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

    const newEvent = await prisma.event.create({
      data: {
        title,
        description: description || "",
        content: content || "",
        date: new Date(dateStr), // Converte string para Date
        location,
        image_path: dbPath,
      },
    });

    return NextResponse.json(newEvent, { status: 201 });

  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Erro ao criar evento" }, { status: 500 });
  }
}