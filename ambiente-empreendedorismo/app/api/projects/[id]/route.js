import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import path from "path";
import fs from "fs";

const prisma = new PrismaClient();

function getIdFromRequest(request) {
  const url = new URL(request.url);
  const id = url.pathname.split('/').pop();
  const numericId = parseInt(id);
  if (isNaN(numericId)) return null;
  return numericId;
}

export async function GET(request) {
  try {
    const numericId = getIdFromRequest(request);
    if (numericId === null) return NextResponse.json({ error: "ID inválido" }, { status: 400 });

    const project = await prisma.project.findUnique({ where: { id: numericId } });
    if (!project) return NextResponse.json({ error: "Projeto não encontrado" }, { status: 404 });

    return NextResponse.json(project, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Erro ao buscar projeto" }, { status: 500 });
  }
}

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
    const tags = data.get('tags');
    const file = data.get('image');

    if (!title || !description || !content) {
      return NextResponse.json({ error: "Campos obrigatórios faltando." }, { status: 400 });
    }

    const existingProject = await prisma.project.findUnique({
      where: { id: numericId },
      select: { image_path: true }
    });

    if (!existingProject) return NextResponse.json({ error: "Projeto não encontrado" }, { status: 404 });
    oldImagePath = existingProject.image_path;

    if (file && file.size > 0) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'projects');
      await fs.promises.mkdir(uploadDir, { recursive: true });
      
      const fileName = `${Date.now()}_${file.name}`;
      const filePath = path.join(uploadDir, fileName);
      await fs.promises.writeFile(filePath, buffer);
      
      dbPath = `/uploads/projects/${fileName}`;
    }

    const dataToUpdate = { title, description, content, tags };
    if (dbPath !== undefined) dataToUpdate.image_path = dbPath;

    const updatedProject = await prisma.project.update({
      where: { id: numericId },
      data: dataToUpdate,
    });

    if (dbPath !== undefined && oldImagePath) {
      try {
        const oldFilePath = path.join(process.cwd(), 'public', oldImagePath);
        if (fs.existsSync(oldFilePath)) await fs.promises.unlink(oldFilePath);
      } catch (e) { console.error("Erro ao deletar imagem antiga:", e); }
    }

    return NextResponse.json(updatedProject, { status: 200 });

  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Erro ao atualizar projeto" }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const numericId = getIdFromRequest(request);
    if (numericId === null) return NextResponse.json({ error: "ID inválido" }, { status: 400 });

    const existingProject = await prisma.project.findUnique({
      where: { id: numericId },
      select: { image_path: true }
    });

    if (!existingProject) return NextResponse.json({ error: "Projeto não encontrado" }, { status: 404 });

    await prisma.project.delete({ where: { id: numericId } });

    if (existingProject.image_path) {
      try {
        const filePath = path.join(process.cwd(), 'public', existingProject.image_path);
        if (fs.existsSync(filePath)) await fs.promises.unlink(filePath);
      } catch (e) { console.error("Erro ao deletar imagem:", e); }
    }

    return NextResponse.json({ message: "Projeto deletado" }, { status: 200 });

  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Erro ao deletar projeto" }, { status: 500 });
  }
}