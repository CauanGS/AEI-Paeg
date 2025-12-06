import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import path from "path";
import fs from "fs";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const programs = await prisma.program.findMany({
      orderBy: { created_at: 'desc' }
    });
    return NextResponse.json(programs, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Erro ao buscar programas" }, { status: 500 });
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
      return NextResponse.json({ error: "Campos obrigatórios faltando." }, { status: 400 });
    }

    if (file && file.size > 0) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'programs');
      await fs.promises.mkdir(uploadDir, { recursive: true });
      
      const fileName = `${Date.now()}_${file.name}`;
      const filePath = path.join(uploadDir, fileName);
      await fs.promises.writeFile(filePath, buffer);
      
      dbPath = `/uploads/programs/${fileName}`;
    }

    const newProgram = await prisma.program.create({
      data: {
        title,
        description,
        content,
        image_path: dbPath,
      },
    });

    return NextResponse.json(newProgram, { status: 201 });

  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Erro ao criar programa" }, { status: 500 });
  }
}
