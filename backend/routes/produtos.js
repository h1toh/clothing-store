const express = require('express')
const router = express.Router()

let produtos = [] // Array Temporario (add mongodb depois)

router.get('/', (req, res) => {
    res.status(200).json(produtos)
})

router.get('/:id', (req, res) => {
    const id = parseInt(req.params.id)
    if (isNaN(id)) {
        return res.status(404).json({ mensagem: "ID Inválido" })
    }

    const produto = produtos.find(p => p.id === id)
    if (!produto) {
        return res.status(404).json({ mensagem: 'Produto não encontrado' })
    }
    res.status(200).json(produto)
})

let proximoId = 1

router.post('/', (req, res) => { // Criar novo Produto
    const { nome, preco } = req.body

    if (typeof nome !== "string" || nome.trim() === " ") {
        return res.status(400).json({ mensagem: "Nome inválido" })
    }
    if (typeof preco !== "number" || preco <= 0) {
        return res.status(400).json({ mensagem: "Número inválido" })
    }

    const novoProduto = {
        id: proximoId++,
        nome: nome.trim(),
        preco
    }

    produtos.push(novoProduto)
    res.status(201).json(novoProduto)
})

router.put('/:id', (req, res) => { // Atualizar produto
    const id = parseInt(req.params.id)
    if (isNaN(id)) {
        return res.status(400).json({ mensagem: "ID Inválido" })
    }

    const produto = produtos.find(p => p.id === id)
    if (!produto) {
        return res.status(404).json({ mensagem: 'Produto não encontrado' })
    }

    const atualizacoes = {}

    const { nome, preco } = req.body
    if (typeof nome === "string" && nome.trim() !== " ") {
        produto.nome = nome
        atualizacoes.nome = true
    }
    if (typeof preco == "number" && preco >= 0) {
        produto.preco = preco
        atualizacoes.preco = true
    }

    if (Object.keys(atualizacoes).length === 0) {
        return res.status(400).json({ mensagem: "Nenhum dado válido enviado para atualização" })
    }

    res.status(200).json({
        mensagem: "Produto atualizado com sucesso",
        atualizado: atualizacoes,
        produto
    })
})

router.delete('/:id', (req, res) => { // Deletar produto
    const id = parseInt(req.params.id)
    if (isNaN(id)) {
        return res.status(400).json({ mensagem: "ID Inválido" })
    }

    const index = produtos.findIndex(p => p.id === id)
    if (index === -1) {
        return res.status(404).json({ mensagem: 'Produto não encontrado' })
    }

    const removido = produtos.splice(index, 1)
    res.status(200).json({ mensagem: 'Produto removido', produto: removido[0] })
})

module.exports = router