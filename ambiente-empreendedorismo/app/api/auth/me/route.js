import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

export async function GET(req) {
  try {
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json({ isLogged: false, role: null });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const usuario = await prisma.usuario.findUnique({
      where: { nome_usuario: decoded.nome_usuario },
      select: { role: true },
    });

    if (!usuario) {
      return NextResponse.json({ isLogged: false, role: null });
    }

    return NextResponse.json({
      isLogged: true,
      role: usuario.role,
    });
  } catch (error) {
    return NextResponse.json({ isLogged: false, role: null });
  }
}