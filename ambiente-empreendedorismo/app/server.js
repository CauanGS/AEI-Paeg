import express from "express";
import { PrismaClient } from "./generated/prisma/index.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const app = express();
const prisma = new PrismaClient();

app.use(express.json());

//importa chave secreta para JWT
import dotenv from "dotenv";
dotenv.config();

const SECRET = process.env.JWT_SECRET;

app.post("/cadastro", async (req, res) => {
    const { nome_usuario, nome, email, senha } = req.body;

    try {
        const senhaHash = await bcrypt.hash(senha, 10);
        const novoUsuario = await prisma.usuario.create({
            data: { nome_usuario, nome, email, senha: senhaHash },
        });

        res.status(201).json({ 
            message: "Usuário criado com sucesso", 
            usuario: novoUsuario 
        });
    } catch (err) {
        console.error(err);
        res.status(400).json({ error: "Erro ao criar usuário" });
    }
});

app.post("/login", async (req, res) => {
    const { nome_usuario, senha } = req.body;

    try {
        const usuario = await prisma.usuario.findUnique({ where: { nome_usuario } });

    if (!usuario) {
        return res.status(404).json({ error: "Usuário não encontrado" });
    }

    const senhaValida = await bcrypt.compare(senha, usuario.senha);
    
    if (!senhaValida) {
        return res.status(401).json({ error: "Senha incorreta" });
    }

    const token = jwt.sign(
        { nome_usuario: usuario.nome_usuario, email: usuario.email },
        SECRET,
        { expiresIn: "2h" }
    );

    res.json({ message: "Login bem-sucedido", token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erro no login" });
    }
});


const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});