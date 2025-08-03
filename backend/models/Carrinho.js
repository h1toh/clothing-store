const mongoose = require('mongoose')

const CarrinhoSchema = new mongoose.Schema({
    produtoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Produto', required: true },
    nome: { type: String, required: true },
    preco: { type: Number, required: true },
    quantidade: [{ type: Number, required: true }],
    tamanho: { type: String, required: true }
})

module.exports = mongoose.model('Carrinho', CarrinhoSchema)