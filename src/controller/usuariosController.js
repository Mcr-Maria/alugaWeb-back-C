import bcrypt from "bcrypt";
import { prisma } from "../services/index.js";

export async function buscarUsuarios() {
    return await prisma.usuarios.findMany();
}

export async function buscarUsuarioPorId(id) {
    return await prisma.usuarios.findUnique({
        where: {
            usuario_id: Number(id)
        }
    });
}

export async function criarUsuario(dados) {
    const saltRounds = 10
    const senhaCriptografada = await bcrypt.hash(dados.usuario_senha, saltRounds)
    const cpfCriptografado = await bcrypt.hash(dados.usuario_cpf, saltRounds)
    const cnpjCriptografado = await bcrypt.hash(dados.usuario_cnpj, saltRounds)
    return await prisma.usuarios.create({
        data: {
            ...dados,
            usuario_senha: senhaCriptografada,
            usuario_cpf: cpfCriptografado,
            usuario_cnpj: cnpjCriptografado
        }

    });
}

export async function editarUsuarios(id, dados) {
    return await prisma.usuarios.update({
        where: {
            usuario_id: Number(id)
        },
        data: dados
    });
}

export async function deletarUsuarios(id) {
    return await prisma.usuarios.delete({
        where: {
            usuario_id: Number(id)
        }
    });
}


