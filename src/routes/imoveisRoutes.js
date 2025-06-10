import { Router } from "express";
import { buscarImoveis, buscarImovelPorId, criarImovel, deletarImovel, editarImovel } from "../controller/imoveisController.js";

const router = Router();

router.get('/', async (req, res) => {
    res.send(await buscarImoveis());
});
router.get('/:id', async (req, res) => {
    res.send(await buscarImovelPorId(req.params.id));
});
router.post('/', async (req, res) => {
    res.send(await criarImovel(req.body));
});
router.put('/:id', async (req, res) => {
    res.send(await editarImovel(req.params.id, req.body));
});
router.delete('/:id', async (req, res) => {
    res.send(await deletarImovel(req.params.id));
});

export {router as imoveisRoutes};