import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import path from "path";
import fs from "fs";

const prisma = global.prisma || new PrismaClient();
if (process.env.NODE_ENV !== "production") global.prisma = prisma;

export async function GET() {
  try {
    const entrepreneurship = await prisma.entrepreneurship.findMany({
      orderBy: {
        created_at: 'desc'
      }
    });
    return NextResponse.json(entrepreneurship, { status: 200 });

  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Erro ao buscar empreendimento" }, 
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
    const type = data.get('type');
    const tag = data.get('tag');
    const file = data.get('image');

    if (!title || !description || !content || !type || !tag) {
      return NextResponse.json(
        { error: "Todos os campos são obrigatórios." },
        { status: 400 }
      );
    }

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
        console.error("Erro ao fazer upload do arquivo:", uploadError);
        return NextResponse.json(
          { error: "Erro ao processar a imagem." }, 
          { status: 500 }
        );
      }
    }

    const newEntrepreneurship = await prisma.entrepreneurship.create({
      data: {
        title: title,
        description: description,
        content: content,
        type: type,
        tag: tag,
        image_path: dbPath,
      },
    });

    return NextResponse.json(newEntrepreneurship, { status: 201 });

  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Erro ao criar empreendimento" }, 
      { status: 500 }
    );
  }
}