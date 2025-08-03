const express = require('express')
const router = express.Router()

let carrinho = []
let proximoId = 1

router.get('/', (req, res) => {
    res.status(200).json(carrinho)
})

router.post('/', (req, res) => {
    const { produtoId, nome, preco, quantidade, tamanho } = req.body

    if (!produtoId || !nome || !preco || !quantidade || !tamanho) {
        return res.status(400).json({ mensagem: 'Dados incompletos para adicionar ao carrinho' })
    }

    const novoItem = {
        id: proximoId++,
        produtoId,
        nome,
        preco,
        quantidade,
        tamanho
    }

    carrinho.push(novoItem)

    res.status(201).json({ mensagem: 'Item adicionado ao carrinho', item: novoItem })
})

router.patch('/:id', (req, res) => {
    const id = parseInt(req.params.id)
    if (isNaN(id)) {
        return res.status(400).json({ mensagem: 'ID Inválido' })
    }

    const item = carrinho.find(p => p.id === id)
    if (!item) {
        return res.status(404).json({ mensagem: 'Item não encontrado no carrinho' })
    }

    const { quantidade, tamanho } = req.body

    if (quantidade !== undefined) {
        item.quantidade = quantidade
    }
    if (tamanho !== undefined) {
        item.tamanho = tamanho
    }

    res.status(200).json({ mensagem: 'Item atualizado com sucesso.', item })
})

router.delete('/', (req, res) => {
    const id = parseInt(req.params.id)
    if (isNaN(id)) {
        return res.status(400).json({ mensagem: "ID Inválido" })
    }

    const index = carrinho.findIndex(item => item.id === id)
    if (index === -1) {
        return res.status(404).json({ mensagem: 'Item não encontrado no carrinho' })
    }

    const itemRemovido = carrinho.splice(index, 1)
    res.status(200).json({ mensagem: 'Item removido do carrinho', item: itemRemovido[0] })
})

router.delete('/:id', (req, res) => {
    carrinho = []
    res.status(200).json({ mensagem: 'Carrinho esvaziado com sucesso' })
})

module.exports = router 