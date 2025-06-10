import { prisma } from "../services/index.js";

export async function buscarImoveis() {
    try {
        return await prisma.imoveis.findMany();
        
    } catch (error) {
        return{
            tipo: "error",
            mensagem: error.message
        }
    }
}

export async function buscarImovelPorId(id) {
    try {
        return await prisma.imoveis.findFirst({
            where: {
                imovel_id: Number(id)
            }
         }) 
            
    } catch (error) {
        return{
            tipo: "error",
            mensagem: error.message
        }
    }
}

export async function criarImovel(dados) {
    try {
        return await prisma.imoveis.create({
            data: dados
        });
    } catch (error) {
        return {
            tipo: "error",
            mensagem: error.message
        }
    }
}

export async function editarImovel(id,dados) {
    try {
        return await prisma.imoveis.update({
            where: {imovel_id: Number(id)},
            data: dados
        })
    } catch (error) {
        return {
            tipo: "error",
            mensagem: error.message
        }
        
    }
}

export async function deletarImovel(id) {
    try {
        return await prisma.imoveis.delete({
            where: {
                imovel_id: Number(id)
            }
        });
    } catch (error) {
        return {
            tipo: "error",
            mensagem: error.message
        }
    }
}
