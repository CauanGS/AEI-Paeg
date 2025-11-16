import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const globalForPrisma = global;

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ["query", "error", "warn"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export async function POST(request) {
  try {
    const { nome_usuario, nome, email, senha } = await request.json();


    if (!nome_usuario || !nome || !email || !senha) {
      return NextResponse.json(
        { error: "Todos os campos são obrigatórios" },
        { status: 400 }
      );
    }

    const usuarioExistente = await prisma.usuario.findUnique({
      where: { nome_usuario },
    });

    if (usuarioExistente) {
      return NextResponse.json(
        { error: "Nome de usuário já está em uso" },
        { status: 409 }
      );
    }

    const emailExistente = await prisma.usuario.findUnique({
      where: { email },
    });

    if (emailExistente) {
      return NextResponse.json(
        { error: "Email já está em uso" },
        { status: 409 }
      );
    }

    const senhaHash = await bcrypt.hash(senha, 10);

    const novoUsuario = await prisma.usuario.create({
      data: {
        nome,
        nome_usuario,
        email,
        senha: senhaHash,
      },
    });

    return NextResponse.json(
      { message: "Usuário criado com sucesso"},
      { status: 201 }
    );
  } catch (err) {
    console.error(err);

    return NextResponse.json(
      { error: "Erro ao criar usuário" },
      { status: 500 }
    );
  }
}