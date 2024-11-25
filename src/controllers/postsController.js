import {getTodosPosts, criarPost, atualizarPost} from "../Models/postsModel.js";
import fs from "fs";
import gerarDescricaoComGemini from "../services/geminiService.js";

export async function listarPosts(req, res) {
    // Chama a função para buscar todos os posts
    const posts = await getTodosPosts();
    // Envia os posts como resposta em formato JSON com status 200 (sucesso)
    res.status(200).json(posts); 
    } 
   
export async function postarNovoPost(req, res) {
    const novoPost = req.body;
    try {
        const postCriado = await criarPost(novoPost);
        res.status (200).json(postCriado); 
    } catch(erro) {
        console.error (erro.message);
        res.status(500).json({"Erro": "Falha na Requisição"})
    }
} 

export async function uploadImagem(req, res) {
    const novoPost = {
        descricao:"",
        imgUrl: req.file.originalname,
        alt:""
    };

    try {
        const postCriado = await criarPost(novoPost);
        const imagemAtualizada = `uploads/${postCriado.insertedId}.png`
        fs.renameSync(req.file.path, imagemAtualizada)
        res.status (200).json(postCriado); 
    } catch(erro) {
        console.error (erro.message);
        res.status(500).json({"Erro": "Falha na Requisição"})
    }
} 

export async function atualizarNovoPost(req, res) {
    const id = req.params.id;
    const urlImagem = `http://localhost:3000/${id}.png`
    const post = {
        imgUrl: urlImagem,
        descrição: req.body.descrição,
        alt: req.body.alt
    }
    try {
        const imgBuffer = fs.readFileSync(`uploads/${id}.png`)
        const descricao = await gerarDescricaoComGemini(imgBuffer)

        const post = {
            imgUrl: urlImagem,
            descrição: descricao,
            alt: req.body.alt
        }

        const postCriado = await atualizarPost(id, post);

        res.status (200).json(postCriado); 
    } catch(erro) {
        console.error (erro.message);
        res.status(500).json({"Erro": "Falha na Requisição"})
    }
} 