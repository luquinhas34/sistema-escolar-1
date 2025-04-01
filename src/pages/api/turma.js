// pages/api/turma.js
import prisma from "../../lib/prisma"; // Ajuste o caminho conforme necessário

// Função para manipular as requisições da API
export default async function handler(req, res) {
  if (req.method === "GET") {
    // Buscar todas as turmas
    try {
      const turmas = await prisma.turma.findMany();
      res.status(200).json(turmas);
    } catch (error) {
      res.status(500).json({ error: "Erro ao buscar turmas" });
    }
  } else if (req.method === "POST") {
    // Criar uma nova turma
    const { nome } = req.body;
    try {
      const turma = await prisma.turma.create({
        data: {
          nome,
        },
      });
      res.status(201).json(turma);
    } catch (error) {
      res.status(500).json({ error: "Erro ao criar turma" });
    }
  } else {
    // Método não permitido
    res.status(405).json({ error: "Método não permitido" });
  }
}
