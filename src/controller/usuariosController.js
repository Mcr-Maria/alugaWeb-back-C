import bcrypt from "bcrypt";
import formidable from "formidable";
import fs from "fs";
import jwt from 'jsonwebtoken';
import path from "path";
import { fileURLToPath } from "url";
import { promisify } from "util";
import { prisma } from "../services/index.js";
const copyFileAsync = promisify(fs.copyFile);
const unlinkAsync = promisify(fs.unlink);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
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

export async function criarUsuario(req, res) {
    try {
        function pegarString(valor) {
            if (Array.isArray(valor)) return String(valor[0]);
            return String(valor);
        }




        const form = formidable({ multiples: true });

        const { fields, files } = await new Promise((resolve, reject) => {
            form.parse(req, (err, fields, files) => {
                if (err) reject(err);
                else resolve({ fields, files });
            });
        });

        if (!files.usuario_imagem) {
            return res.status(400).json({
                tipo: "warning",
                mensagem: "O arquivo é obrigatório"
            });
        }

        const filenameOriginal = files.usuario_imagem.originalFilename || files.usuario_imagem[0]?.originalFilename;

        if (!filenameOriginal || (!filenameOriginal.includes("png") && !filenameOriginal.includes("jpg") && !filenameOriginal.includes("jpeg"))) {
            return res.status(400).json({
                tipo: "warning",
                mensagem: "O arquivo precisa ser do tipo png, jpg ou jpeg"
            });
        }

        const oldpath = files.usuario_imagem.filepath || files.usuario_imagem[0]?.filepath;
        const filenameParts = filenameOriginal.split('.');
        const sanitizedBaseName = filenameParts[0].replace(/\s+/g, '-');
        const newFilename = `${sanitizedBaseName}-${Date.now()}.${filenameParts[1]}`;
        const newpath = path.join(__dirname, '../uploads/imoveis', newFilename);


        fs.mkdirSync(path.dirname(newpath), { recursive: true });

        await copyFileAsync(oldpath, newpath);
        await unlinkAsync(oldpath);

        const saltRounds = 10;
        const senhaCriptografada = await bcrypt.hash(pegarString(fields.usuario_senha), saltRounds);
        const nivelInt = parseInt(fields.usuario_nivel, 10);
        await prisma.usuarios.create({
            data: {
                usuario_nome: pegarString(fields.usuario_nome),
                usuario_email: pegarString(fields.usuario_email),
                usuario_senha: senhaCriptografada,
                usuario_cpf: pegarString(fields.usuario_cpf),
                usuario_cnpj: pegarString(fields.usuario_cnpj),
                usuario_telefone: pegarString(fields.usuario_telefone),
                usuario_nascimento: pegarString(fields.usuario_nascimento),
                usuario_nivel: nivelInt,
                usuario_imagem: 'http://localhost:8000/uploads/imoveis/' + newFilename
            }
        });

        return res.status(201).json({ tipo: "success", mensagem: "Usuário criado com sucesso" });

    } catch (error) {
        return res.status(500).json({ tipo: "error", mensagem: error.message });
    }
}


export async function editarUsuarios(id, data) {
    const saltRounds = 10
    const senhaCriptografada = await bcrypt.hash(dados.usuario_senha, saltRounds)

    try {
        return await prisma.usuarios.update({
            where: {
                usuario_id: Number(id)
            },
            data: {
                usuario_nome: data.usuario_nome,
                usuario_email: data.usuario_email,
                usuario_senha: senhaCriptografada,
                usuario_cpf: data.usuario_cpf,
                usuario_cnpj: data.usuario_cnpj,
                usuario_telefone: data.usuario_telefone,
                usuario_nascimento: data.usuario_nascimento,
                usuario_nivel: data.usuario_nivel,
                usuario_imagem: data.usuario_imagem
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