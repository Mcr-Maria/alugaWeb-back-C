import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
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
    const saltRounds = 10
    const senhaCriptografada = await bcrypt.hash(dados.usuario_senha, saltRounds)
    const cpfCriptografado = await bcrypt.hash(dados.usuario_cpf, saltRounds)
    const cnpjCriptografado = await bcrypt.hash(dados.usuario_cnpj, saltRounds)
    try {
        return await prisma.usuarios.update({
            where: {
                usuario_id: Number(id)
            },
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


export async function login(dados) {

    const { usuario_email, usuario_senha } = dados
    try {
        const user = await prisma.usuarios.findFirst({
            where: {
                usuario_email
            },
        })
        if (!user) {
            return ("Credencias inválidas1")
        }
        const senhaComparada = await bcrypt.compare(usuario_senha, user.usuario_senha);
        console.log(senhaComparada)
        if (!senhaComparada) {
            return "Credenciais inválidas2"
        }
        const token = jwt.sign({ usuario_id: user.usuario_id }, process.env.JWT_SECRET, {
            expiresIn: "1h",
        });

        return {
            type: "Success",
            mensagem: "Usuário logado",
            token,
            usuario: user
        }
    } catch (error) {
        return error.message;
    }


}