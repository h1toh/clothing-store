const mongoose = require('mongoose')

async function conectaMongoDB() {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log('MongoDB conectado com sucesso')
    } catch (erro) {
        console.error('Erro ao conectar ao MongoDB', erro)
        process.exit(1)
    }
}

module.exports = conectaMongoDB