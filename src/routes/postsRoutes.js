import express from "express"; // Importa o módulo Express para criar o servidor web
import multer from "multer"; // Importa o módulo Multer para lidar com uploads de arquivos
import { listarPosts, postarNovoPost, uploadImagem, atualizarNovoPost } from "../controllers/postsController.js"; // Importa as funções controladoras do arquivo postsController.js
import cors from "cors";

const corsOptions = {
  origin: "http://localhost:8000",
  opitionsSucessStatus: 200
}

// Configura o armazenamento de arquivos para o Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) { // Define o diretório de destino para os uploads
    cb(null, 'uploads/'); // Define o caminho do diretório como 'uploads/'
  },
  filename: function (req, file, cb) { // Define o nome do arquivo no servidor
    cb(null, file.originalname); // Utiliza o nome original do arquivo enviado
  }
});

// Cria uma instância do middleware Multer com as configurações de armazenamento
const upload = multer({ dest: "./uploads", storage }); // Define o diretório de destino (opcional) e usa o storage configurado anteriormente

// Define uma função para montar as rotas da aplicação
const routes = (app) => {
  // Habilita o middleware express.json para que o servidor possa entender requisições com corpo no formato JSON
  app.use(express.json());
  app.use(cors(corsOptions))

  // Rota GET para listar todos os posts (deve ser implementada na função listarPosts)
  app.get("/posts", listarPosts);

  // Rota POST para criar um novo post (deve ser implementada na função postarNovoPost)
  app.post("/posts", postarNovoPost);

  // Rota POST para upload de imagens (utiliza o middleware upload.single("imagem") para processar o upload e chama a função uploadImagem)
  app.post("/upload", upload.single("imagem"), uploadImagem);

  app.put("/upload/:id", atualizarNovoPost)
};

// Exporta a função routes para ser usada no arquivo principal (server.js)
export default routes;