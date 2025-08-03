const mongoose = require('mongoose')

const itemCarrinhoSchema = new mongoose.Schema({
    produtoId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Produto',
        required: true
    },
    nome: {
        type: String,
        required: true
    },
    preco: {
        type: Number,
        required: true
    },
    quantidade: {
        type: Number,
        required: true
    },
    tamanho: {
        type: String,
        enum: ['P', 'M', 'G', 'GG'],
        required: true
    }
})

const CarrinhoSchema = new mongoose.Schema({
    itens: [itemCarrinhoSchema],
    criadoEm: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Carrinho', CarrinhoSchema)