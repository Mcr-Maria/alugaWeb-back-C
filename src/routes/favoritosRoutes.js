import { Router } from "express";
import { adicionarFavorito, listarFavoritos, removerFavorito } from "../controller/favoritorController.js";

const router = Router();



router.post('/', adicionarFavorito);


router.get('/:usuario_id', listarFavoritos);


router.delete('/', removerFavorito);

export { router as favoritosRoutes };

