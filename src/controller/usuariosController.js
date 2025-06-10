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
    return await prisma.usuarios.create({
        data: dados
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


