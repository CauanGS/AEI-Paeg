import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const globalForPrisma = global;

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ["query", "error", "warn"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export async function POST(request) {
    try {
        const { nome_usuario, senha } = await request.json();

        const usuario = await prisma.usuario.findUnique({
            where: { nome_usuario }
        });

        if (!usuario) {
            return NextResponse.json(
                { error: "Usuário não encontrado" }, 
                { status: 404 }
            );
        }

        const senhaValida = await bcrypt.compare(senha, usuario.senha);

        if (!senhaValida) {
            return NextResponse.json(
                { error: "Senha incorreta" }, 
                { status: 401 }
            );
        }

        const token = jwt.sign(
            { nome_usuario: usuario.nome_usuario, email: usuario.email },
            process.env.JWT_SECRET,
            { expiresIn: "2h" }
        );

        const response = NextResponse.json({
            message: "Login bem-sucedido"
        });

        response.cookies.set("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            path: "/",
            maxAge: 60 * 60 * 2, // 2 horas
        });

        return response;

    } catch (err) {
        console.error(err);
        return NextResponse.json(
            { error: "Erro no login" }, 
            { status: 500 }
        );
    }
}