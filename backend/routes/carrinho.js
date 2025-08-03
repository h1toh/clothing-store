const express = require('express')
const router = express.Router()

let carrinho = []
let proximoId = 1
const tamanhosValidos = ['P', 'M', 'G', 'GG']

router.get('/', (req, res) => {
    res.status(200).json(carrinho)
})

router.post('/', (req, res) => {
    const { produtoId, nome, preco, quantidade, tamanho } = req.body

    if (typeof produtoId !== 'number' || produtoId <= 0) {
        return res.status(400).json({ mensagem: 'ID do produto inválido' })
    }
    if (typeof nome !== 'string' || nome.trim() === '') {
        return res.status(400).json({ mensagem: 'Nome do produto inválido' })
    }
    if (typeof preco !== 'number' || preco <= 0) {
        return res.status(400).json({ mensagem: 'Preço inválido' })
    }
    if (typeof quantidade !== 'number' || quantidade <= 0) {
        return res.status(400).json({ mensagem: 'Quantidade inválida' })
    }

    if (!tamanhosValidos.includes(tamanho)) {
        return res.status(400).json({ mensagem: 'Tamanho inválido. Use: P, M, G ou GG' })
    }

    const novoItem = {
        id: proximoId++,
        produtoId,
        nome: nome.trim(),
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
        if (typeof quantidade !== 'number' || quantidade <= 0) {
            return res.status(400).json({ mensagem: 'Quantidade inválida' })
        }
        item.quantidade = quantidade
    }
    if (tamanho !== undefined) {
        if (!tamanhosValidos.includes(tamanho)) {
            return res.status(400).json({ mensagem: 'Tamanho inválido' })
        }
        item.tamanho = tamanho
    }

    res.status(200).json({ mensagem: 'Item atualizado com sucesso.', item })
})

router.delete('/:id', (req, res) => {
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

router.delete('/', (req, res) => {
    carrinho = []
    res.status(200).json({ mensagem: 'Carrinho esvaziado com sucesso' })
})

module.exports = router 