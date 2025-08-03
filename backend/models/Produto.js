const mongoose = require('mongoose')

const ProdutoSchema = new mongoose.Schema({
    nome: {
        type: String,
        required: true,
        trim: true
    },
    preco: {
        type: Number,
        required: true,
        min: 0
    },
    categoria: { 
        type: String, 
        required: true,
        trim: true
    },
    estoque: {
        type: Map, 
        of: Number,
        default: {}
    }
})

module.exports = mongoose.model('Produto', ProdutoSchema)