import { prisma } from "../services/index.js";



export const adicionarFavorito = async (req, res) => {
  const { usuario_id, imovel_id } = req.body;

  try {
    const favoritoExistente = await prisma.favoritos.findFirst({
      where: { usuario_id, imovel_id }
    });

    if (favoritoExistente) {
      return res.status(400).json({ message: 'Imóvel já está nos favoritos.' });
    }

    const novoFavorito = await prisma.favoritos.create({
      data: { usuario_id, imovel_id }
    });

    res.status(201).json(novoFavorito);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao adicionar favorito.' });
  }
};

export const listarFavoritos = async (req, res) => {
  const { usuario_id } = req.params;

  try {
    const favoritos = await prisma.favoritos.findMany({
      where: { usuario_id: Number(usuario_id) },
      include: {
        imoveis: true,
      },
    });

  
    res.json(favoritos);
  } catch (error) {
    res.status(500).json({ error: "Erro ao listar favoritos." });
  }
};

export const removerFavorito = async (req, res) => {
  const { usuario_id, imovel_id } = req.params;

  try {
    await prisma.favoritos.deleteMany({
      where: {
        usuario_id: Number(usuario_id),
        imovel_id: Number(imovel_id),
      },
    });

    res.json({ message: 'Favorito removido com sucesso.' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao remover favorito.' });
  }
};


