-- CreateTable
CREATE TABLE "favoritos" (
    "favorito_id" SERIAL NOT NULL,
    "usuario_id" INTEGER NOT NULL,
    "imovel_id" INTEGER NOT NULL,

    CONSTRAINT "favoritos_pkey" PRIMARY KEY ("favorito_id")
);

-- CreateTable
CREATE TABLE "imoveis" (
    "imovel_id" SERIAL NOT NULL,
    "imovel_estado" VARCHAR(50) NOT NULL,
    "imovel_cidade" VARCHAR(50) NOT NULL,
    "imovel_bairro" VARCHAR(50) NOT NULL,
    "imovel_logradouro" VARCHAR(100) NOT NULL,
    "imovel_numero" VARCHAR(5) NOT NULL,
    "imovel_complemento" VARCHAR(50),
    "imovel_cep" VARCHAR(20) NOT NULL,
    "imovel_tipo" VARCHAR(20) NOT NULL,
    "imovel_modalidade" VARCHAR(20) NOT NULL,
    "imovel_valor" VARCHAR(255) NOT NULL,
    "imovel_valor_condominio" VARCHAR(255),
    "imovel_imagem" VARCHAR(255) NOT NULL,
    "imovel_descricao" VARCHAR(255) NOT NULL,
    "imovel_quartos" INTEGER NOT NULL DEFAULT 0,
    "imovel_garagens" INTEGER NOT NULL DEFAULT 0,
    "imovel_banheiros" INTEGER NOT NULL DEFAULT 0,
    "imovel_area" INTEGER NOT NULL,
    "imovel_contato1" VARCHAR(15) NOT NULL,
    "imovel_contato2" VARCHAR(15),

    CONSTRAINT "imoveis_pkey" PRIMARY KEY ("imovel_id")
);

-- CreateTable
CREATE TABLE "usuarios" (
    "usuario_id" SERIAL NOT NULL,
    "usuario_nome" VARCHAR(100) NOT NULL,
    "usuario_email" VARCHAR(100) NOT NULL,
    "usuario_senha" VARCHAR(255) NOT NULL,
    "usuario_cpf" VARCHAR(15),
    "usuario_cnpj" INTEGER,
    "usuario_telefone" VARCHAR(15) NOT NULL,
    "usuario_nascimento" VARCHAR(15) NOT NULL,
    "usuario_nivel" INTEGER,
    "usuario_imagem" VARCHAR(255) NOT NULL,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("usuario_id")
);

-- AddForeignKey
ALTER TABLE "favoritos" ADD CONSTRAINT "favoritos_fk1" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("usuario_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "favoritos" ADD CONSTRAINT "favoritos_fk2" FOREIGN KEY ("imovel_id") REFERENCES "imoveis"("imovel_id") ON DELETE NO ACTION ON UPDATE NO ACTION;
