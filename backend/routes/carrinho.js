const express = require('express');
const router = express.Router();
const Carrinho = require('../models/Carrinho'); // ajuste o caminho conforme sua estrutura
const tamanhosValidos = ['P', 'M', 'G', 'GG'];

// GET /carrinho - listar os itens do carrinho
router.get('/', async (req, res) => {
    try {
        // Considerando um único carrinho (exemplo)
        let carrinho = await Carrinho.findOne();
        if (!carrinho) {
            // Cria um carrinho vazio caso não exista
            carrinho = new Carrinho({ itens: [] });
            await carrinho.save();
        }
        res.status(200).json(carrinho.itens);
    } catch (error) {
        res.status(500).json({ mensagem: 'Erro ao buscar o carrinho', erro: error.message });
    }
});

// POST /carrinho - adicionar item ao carrinho
router.post('/', async (req, res) => {
    const { produtoId, nome, preco, quantidade, tamanho } = req.body;

    if (typeof produtoId !== 'number' && !produtoId) {
        return res.status(400).json({ mensagem: 'ID do produto inválido' });
    }
    if (typeof nome !== 'string' || nome.trim() === '') {
        return res.status(400).json({ mensagem: 'Nome do produto inválido' });
    }
    if (typeof preco !== 'number' || preco <= 0) {
        return res.status(400).json({ mensagem: 'Preço inválido' });
    }
    if (typeof quantidade !== 'number' || quantidade <= 0) {
        return res.status(400).json({ mensagem: 'Quantidade inválida' });
    }
    if (!tamanhosValidos.includes(tamanho)) {
        return res.status(400).json({ mensagem: 'Tamanho inválido. Use: P, M, G ou GG' });
    }

    try {
        let carrinho = await Carrinho.findOne();
        if (!carrinho) {
            carrinho = new Carrinho({ itens: [] });
        }

        // Aqui poderia verificar se o produto já existe para somar quantidade, mas vamos só adicionar
        const novoItem = { produtoId, nome: nome.trim(), preco, quantidade, tamanho };

        carrinho.itens.push(novoItem);
        await carrinho.save();

        res.status(201).json({ mensagem: 'Item adicionado ao carrinho', item: novoItem });
    } catch (error) {
        res.status(500).json({ mensagem: 'Erro ao adicionar item ao carrinho', erro: error.message });
    }
});

// PATCH /carrinho/:id - atualizar item do carrinho pelo _id do item (MongoDB ObjectId)
router.patch('/:id', async (req, res) => {
    const itemId = req.params.id;
    const { quantidade, tamanho } = req.body;

    if (quantidade !== undefined && (typeof quantidade !== 'number' || quantidade <= 0)) {
        return res.status(400).json({ mensagem: 'Quantidade inválida' });
    }
    if (tamanho !== undefined && !tamanhosValidos.includes(tamanho)) {
        return res.status(400).json({ mensagem: 'Tamanho inválido' });
    }

    try {
        const carrinho = await Carrinho.findOne();
        if (!carrinho) {
            return res.status(404).json({ mensagem: 'Carrinho não encontrado' });
        }

        // Encontra o item pelo id (ObjectId do subdocumento)
        const item = carrinho.itens.id(itemId);
        if (!item) {
            return res.status(404).json({ mensagem: 'Item não encontrado no carrinho' });
        }

        if (quantidade !== undefined) item.quantidade = quantidade;
        if (tamanho !== undefined) item.tamanho = tamanho;

        await carrinho.save();

        res.status(200).json({ mensagem: 'Item atualizado com sucesso.', item });
    } catch (error) {
        res.status(500).json({ mensagem: 'Erro ao atualizar item', erro: error.message });
    }
});

// DELETE /carrinho/:id - remover item do carrinho pelo _id do item
router.delete('/:id', async (req, res) => {
    const itemId = req.params.id;

    try {
        const carrinho = await Carrinho.findOne();
        if (!carrinho) {
            return res.status(404).json({ mensagem: 'Carrinho não encontrado' });
        }

        const item = carrinho.itens.id(itemId);
        if (!item) {
            return res.status(404).json({ mensagem: 'Item não encontrado no carrinho' });
        }

        item.remove();
        await carrinho.save();

        res.status(200).json({ mensagem: 'Item removido do carrinho', item });
    } catch (error) {
        res.status(500).json({ mensagem: 'Erro ao remover item', erro: error.message });
    }
});

// DELETE /carrinho - esvaziar o carrinho
router.delete('/', async (req, res) => {
    try {
        let carrinho = await Carrinho.findOne();
        if (!carrinho) {
            carrinho = new Carrinho({ itens: [] });
        } else {
            carrinho.itens = [];
        }
        await carrinho.save();

        res.status(200).json({ mensagem: 'Carrinho esvaziado com sucesso' });
    } catch (error) {
        res.status(500).json({ mensagem: 'Erro ao esvaziar carrinho', erro: error.message });
    }
});

module.exports = router;