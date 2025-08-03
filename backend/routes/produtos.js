const express = require('express')
const router = express.Router()
const Produto = require('../models/Produto')

// GET /produtos
router.get('/', async (req, res) => {
    try {
        const { nome, categoria, minPreco, maxPreco, sort, page = 1, limit = 0 } = req.query
        const filtro = {}

        if (nome) filtro.nome = { $regex: nome, $options: 'i' }
        if (categoria) filtro.categoria = new RegExp(`^${categoria}$`, 'i')
        if (minPreco || maxPreco) filtro.preco = {}
        if (minPreco) filtro.preco.$gte = Number(minPreco)
        if (maxPreco) filtro.preco.$lte = Number(maxPreco)

        let query = Produto.find(filtro)

        if (sort === "price_asc") query = query.sort({ preco: 1 })
        else if (sort === "price_desc") query = query.sort({ preco: -1 })
        else if (sort === "name_asc") query = query.sort({ nome: 1 })

        const skip = (parseInt(page) - 1) * parseInt(limit)
        if (limit) query = query.skip(skip).limit(parseInt(limit))

        const resultados = await query
        const total = await Produto.countDocuments(filtro)

        res.status(200).json({ total, pagina: parseInt(page), limite: parseInt(limit), resultados })
    } catch (e) {
        res.status(500).json({ mensagem: 'Erro ao buscar produtos', erro: e.message })
    }
})

// GET /produtos/:id
router.get('/:id', async (req, res) => {
    try {
        const produto = await Produto.findById(req.params.id)
        if (!produto) return res.status(404).json({ mensagem: 'Produto não encontrado' })
        res.status(200).json(produto)
    } catch {
        res.status(400).json({ mensagem: 'ID inválido' })
    }
})

// POST /produtos
router.post('/', async (req, res) => {
    try {
        const { nome, preco, categoria, estoque } = req.body
        const novoProduto = new Produto({ nome, preco, categoria, estoque })
        await novoProduto.save()
        res.status(201).json(novoProduto)
    } catch (e) {
        res.status(400).json({ mensagem: 'Erro ao criar produto', erro: e.message })
    }
})

// PUT /produtos/:id
router.put('/:id', async (req, res) => {
    try {
        const atualizacoes = req.body
        const produto = await Produto.findByIdAndUpdate(req.params.id, atualizacoes, { new: true, runValidators: true })

        if (!produto) return res.status(404).json({ mensagem: 'Produto não encontrado' })
        res.status(200).json({ mensagem: 'Produto atualizado', produto })
    } catch (e) {
        res.status(400).json({ mensagem: 'Erro ao atualizar', erro: e.message })
    }
})

// PATCH /produtos/:id/estoque
router.patch('/:id/estoque', async (req, res) => {
    try {
        const atualizacoes = req.body
        const produto = await Produto.findById(req.params.id)

        if (!produto) return res.status(404).json({ mensagem: 'Produto não encontrado' })

        for (const tamanho in atualizacoes) {
            produto.estoque.set(tamanho, atualizacoes[tamanho])
        }

        await produto.save()
        res.status(200).json({ mensagem: 'Estoque atualizado', estoque: produto.estoque })
    } catch (e) {
        res.status(400).json({ mensagem: 'Erro ao atualizar estoque', erro: e.message })
    }
})

// DELETE /produtos/:id
router.delete('/:id', async (req, res) => {
    try {
        const produto = await Produto.findByIdAndDelete(req.params.id)
        if (!produto) return res.status(404).json({ mensagem: 'Produto não encontrado' })
        res.status(200).json({ mensagem: 'Produto removido', produto })
    } catch {
        res.status(400).json({ mensagem: 'ID inválido' })
    }
})

module.exports = router