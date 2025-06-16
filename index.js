import cors from "cors";
import express from "express";
import path from "path";
import { fileURLToPath } from 'url';
import { login } from "./src/controller/usuariosController.js";
import { imoveisRoutes } from "./src/routes/imoveisRoutes.js";
import { usuariosRoutes } from "./src/routes/usuariosRoutes.js";
import { verificarToken } from "./src/utils/index.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const port = 8000;


app.use(cors());
app.use(express.json());


app.post("/login", async (req, res) => {
    res.send(await login(req.body))
})

app.use('/files', express.static(path.join(__dirname, 'uploads')));



app.use("/usuarios", usuariosRoutes)

app.use("/imoveis", verificarToken, imoveisRoutes)

app.use((req, res) => {
    res.status(404).send("Rota não encontrada")
})

app.listen(port, () => {
    console.log(`Servidor rodando na porta: http://localhost:${port}`)
})