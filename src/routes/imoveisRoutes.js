import { Router } from "express";
import { buscarImoveis, buscarImovelPorId, criarImovel, deletarImovel, editarImovel, pesquisarImovelPorQuery } from "../controller/imoveisController.js";

const router = Router();

router.get('/', async (req, res) => {
    res.send(await buscarImoveis());
});

router.get("/", async (req, res) => {
    res.send(await pesquisarImovelPorQuery(req.params))
})

router.get('/:id', async (req, res) => {
    res.send(await buscarImovelPorId(req.params.id));
});


router.post('/', async (req, res) => {
    const resultado = await criarImovel(req);
    if (resultado.tipo === "error" || resultado.tipo === "warning") {
        return res.status(400).json(resultado);
    }
    res.json({ message: "Imóvel criado com sucesso" });
});

router.put('/:id', async (req, res) => {
    res.send(await editarImovel(req.params.id, req.body));
});
router.delete('/:id', async (req, res) => {
    res.send(await deletarImovel(req.params.id));
});

export { router as imoveisRoutes };

