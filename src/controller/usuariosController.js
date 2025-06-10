import bcrypt from "bcrypt";
import { prisma } from "../services/index.js";

export async function buscarUsuarios() {
    try {
        return await prisma.usuarios.findMany();
    } catch (error) {
        return error.message
    }
}

export async function buscarUsuarioPorId(id) {
    try {
        return await prisma.usuarios.findUnique({
            where: {
                usuario_id: Number(id)
            }
        });
    } catch (error) {
        return error.message
    }
}

export async function criarUsuario(dados) {
    try {
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
    } catch (error) {
        return error.message
    }
}

export async function editarUsuarios(id, dados) {
    try {
        return await prisma.usuarios.update({
            where: {
                usuario_id: Number(id)
            },
            data: dados
        });
    } catch (error) {
        return error.message
    }
}

export async function deletarUsuarios(id) {
    try {
        return await prisma.usuarios.delete({
            where: {
                usuario_id: Number(id)
            }
        });
    } catch (error) {
        return error.message
    }
}


