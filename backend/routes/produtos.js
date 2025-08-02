const express = require('express')
const router = express.Router()

let produtos = [] // Array Temporario (add mongodb depois)

router.get('/', (req, res) => {

    const { nome, categoria, minPreco, maxPreco, sort, page, limit } = req.query;

    let resultado = [...produtos]

    if (nome) {
        resultado = resultado.filter(p => p.nome.toLowerCase().includes(nome.toLowerCase()))
    }

    if (categoria) {
        resultado = resultado.filter(p => p.categoria.toLowerCase() === categoria.toLowerCase())
    }

    if (minPreco) {
        resultado = resultado.filter(p => p.preco >= Number(minPreco))
    }
    if (maxPreco) {
        resultado = resultado.filter(p => p.preco <= Number(maxPreco))
    }

    // Ordenação

    if (sort === "price_asc") {
        resultado.sort((a, b) => a.preco - b.preco)
    } else if (sort === "price_desc") {
        resultado.sort((a, b) => b.preco - a.preco)
    } else if (sort === "name_asc") {
        resultado.sort((a, b) => a.nome.localeCompare(b.nome))
    }

    // Paginação

    const pageNumber = parseInt(page) || 1
    const limitNumber = parseInt(limit) || resultado.length
    const startIndex = (pageNumber - 1) * limitNumber
    const endIndex = startIndex + limitNumber

    const paginado = resultado.slice(startIndex, endIndex);

    res.status(200).json({
        total: resultado.length,
        pagina: pageNumber,
        limite: limitNumber,
        resultados: paginado
    })
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
    const { nome, preco, categoria, estoque } = req.body

    if (typeof nome !== "string" || nome.trim() === "") {
        return res.status(400).json({ mensagem: "Nome inválido" })
    }
    if (typeof preco !== "number" || preco <= 0) {
        return res.status(400).json({ mensagem: "Número inválido" })
    }
    if (typeof categoria !== "string" || categoria.trim() === "") {
        return res.status(400).json({ mensagem: "Categoria inválida" })
    }
    if (typeof estoque !== "object" || estoque === null || Array.isArray(estoque)) {
        return res.status(400).json({ mensagem: "Estoque deve ser um objeto com tamanhos e quantidades" })
    }

    for (const tamanho in estoque) {
        const quantidade = estoque[tamanho]
        if (typeof (quantidade) !== "number" || quantidade < 0) {
            return res.status(400).json({ mensagem: `Quantidade inválida para o tamanho ${tamanho}` })
        }
    }

    const novoProduto = {
        id: proximoId++,
        nome: nome.trim(),
        preco,
        categoria: categoria.trim(),
        estoque
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

    const { nome, preco, categoria, estoque } = req.body
    if (typeof nome === "string" && nome.trim() !== "") {
        produto.nome = nome
        atualizacoes.nome = true
    }
    if (typeof preco == "number" && preco >= 0) {
        produto.preco = preco
        atualizacoes.preco = true
    }
    if (typeof categoria === "string" && nome.trim() !== "") {
        produto.categoria = categoria
        atualizacoes.categoria = true
    }
    if (estoque && typeof estoque === "object" && !Array.isArray(estoque)) {
        for (const tamanho in estoque) {
            const quantidade = estoque[tamanho]
            if (typeof quantidade !== 'number' || quantidade < 0) {
                return res.status(400).json({ mensagem: `Quantidade inválida para o tamanho ${tamanho}` })
            }
        }
        produto.estoque = { ...produto.estoque, ...estoque }
        atualizacoes.estoque = true
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

router.patch('/:id/estoque', (req, res) => {
    const id = parseInt(req.params.id)
    if (isNaN(id)) {
        return res.status(400).json({ mensagem: 'ID Inválido' })
    }

    const produto = produtos.find(p => p.id === id)
    if (!produto) {
        return res.status(404).json({ mensagem: 'Produto não encontrado' })
    }

    if (!produto.estoque || typeof produto.estoque !== 'object') {
        return res.status(500).json({ mensagem: 'Produto sem estrutura de estoque válida' })
    }

    const atualizacoes = req.body
    const tamanhosValidos = ['P', 'M', 'G', 'GG']
    let atualizado = false

    for (const tamanho in atualizacoes) {
        if (tamanhosValidos.includes(tamanho) && typeof atualizacoes[tamanho] === 'number') {
            produto.estoque[tamanho] = atualizacoes[tamanho]
            atualizado = true
        }
    }

    if (!atualizado) {
        return res.status(400).json({ mensagem: 'Nenhum dado válido para atualizar o estoque' })
    }

    res.status(200).json({ mensagem: 'Estoque atualizado com sucesso', estoque: produto.estoque })
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