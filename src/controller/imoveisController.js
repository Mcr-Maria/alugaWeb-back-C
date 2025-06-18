import { formidable } from "formidable";
import { copyFile as copyFileAsync, unlink as unlinkAsync } from 'fs/promises';
import path from "path";
import { fileURLToPath } from "url";
import { prisma } from "../services/index.js";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


export async function buscarImoveis(req, res) {
    const { modalidade, cidade, estado, tipo, precoMin, precoMax, quartos, banheiros, garagens } = req.query;
    try {
        const imoveis = await prisma.imoveis.findMany({
            where: {
                ...(modalidade && { imovel_modalidade: modalidade }),
                ...(cidade && { imovel_cidade: cidade }),
                ...(estado && { imovel_estado: estado }),
                ...(tipo && { imovel_tipo: tipo }),
                ...(quartos && { imovel_quartos: parseInt(quartos) }),
                ...(banheiros && { imovel_banheiros: parseInt(banheiros) }),
                ...(garagens && { imovel_garagens: parseInt(garagens) }),
                ...(precoMin && {
                    imovel_valor: {
                        gte: precoMin.toString()
                    }
                }),
                ...(precoMax && {
                    imovel_valor: {
                        lte: precoMax.toString()
                    }
                }),

            },
        });

        res.json(imoveis);
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: "Erro" });
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
        return {
            tipo: "error",
            mensagem: error.message
        }
    }
}

export async function criarImovel(req) {
    try {
        const form = formidable({ multiples: true });

        const { fields, files } = await new Promise((resolve, reject) => {
            form.parse(req, (err, fields, files) => {
                if (err) reject(err);
                else resolve({ fields, files });
            });
        });

        if (!files.imovel_imagem) {
            return {
                tipo: "warning",
                mensagem: "O arquivo é obrigatório"
            };
        }

        const filenameOriginal = files.imovel_imagem.originalFilename || files.imovel_imagem[0]?.originalFilename;

        if (!filenameOriginal || (!filenameOriginal.includes("png") && !filenameOriginal.includes("jpg") && !filenameOriginal.includes("jpeg"))) {
            return {
                tipo: "warning",
                mensagem: "O arquivo precisa ser do tipo PNG, JPG ou JPEG"
            };
        }

        const oldpath = files.imovel_imagem.filepath || files.imovel_imagem[0]?.filepath;

        const filenameParts = filenameOriginal.split('.');
        const sanitizedBaseName = filenameParts[0].replace(/\s+/g, '-');
        const newFilename = `${sanitizedBaseName}-${Date.now()}.${filenameParts[1]}`;
        const newpath = path.join(__dirname, '../uploads/imoveis', newFilename);

        await copyFileAsync(oldpath, newpath);
        await unlinkAsync(oldpath);

        function pegarString(valor) {
            if (Array.isArray(valor)) return String(valor[0]);
            return String(valor);
        }

        await prisma.imoveis.create({
            data: {
                imovel_estado: pegarString(fields.imovel_estado),
                imovel_cidade: pegarString(fields.imovel_cidade),
                imovel_bairro: pegarString(fields.imovel_bairro),
                imovel_logradouro: pegarString(fields.imovel_logradouro),
                imovel_numero: pegarString(fields.imovel_numero),
                imovel_complemento: pegarString(fields.imovel_complemento),
                imovel_cep: pegarString(fields.imovel_cep),
                imovel_tipo: pegarString(fields.imovel_tipo),
                imovel_modalidade: pegarString(fields.imovel_modalidade),
                imovel_valor: pegarString(fields.imovel_valor),
                imovel_valor_condominio: fields.imovel_valor_condominio ? pegarString(fields.imovel_valor_condominio) : null,
                imovel_imagem: 'http://localhost:8000/uploads/imoveis/' + newFilename,
                imovel_descricao: pegarString(fields.imovel_descricao),
                imovel_quartos: Number(pegarString(fields.imovel_quartos)),
                imovel_garagens: Number(pegarString(fields.imovel_garagens)),
                imovel_banheiros: Number(pegarString(fields.imovel_banheiros)),
                imovel_area: Number(pegarString(fields.imovel_area)),
                imovel_contato1: pegarString(fields.imovel_contato1),
                imovel_contato2: pegarString(fields.imovel_contato2)
            }
        });
        return { tipo: "success", mensagem: "Imóvel criado com sucesso" };

    } catch (error) {
        return { tipo: "error", mensagem: error.message };
    }
}

export async function editarImovel(id, dados) {
    try {
        return await prisma.imoveis.update({
            where: { imovel_id: Number(id) },
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
