import { Router } from "express";
import { adicionarFavorito, listarFavoritos, removerFavorito } from "../controller/favoritorController.js";

const router = Router();



router.post('/', adicionarFavorito);


router.get('/:usuario_id', listarFavoritos);


router.delete('/:usuario_id/:imovel_id', removerFavorito);


export { router as favoritosRoutes };

