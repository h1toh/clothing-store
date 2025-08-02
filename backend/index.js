const express = require('express')
const app = express()

app.use(express.json())

const PORT = 3000

const produtos = require('./routes/produtos')
app.use('/produtos', produtos)

app.get('/', (req, res) => {
    res.send('API Funcionando Wow')
})

app.listen(PORT, () => {
    console.log(`rodando em http://localhost:${PORT}`)
})