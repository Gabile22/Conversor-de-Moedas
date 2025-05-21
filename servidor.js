//servidor.js
const express = require("express")
const path = require("path")
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args))

const app = express()
const porta = 3000

//Chave da API
const API_KEY = "da349268a7541e46bf571e2886cb4ba3"

//Pegar os arquivos da pasta public
app.use(express.static("public"))

//Rota para converter a moeda
//req e res = requisição e resposta
app.get("/converter", async (req, res) => {
    try {
        const {valor, de, para} = req.query

        if(!valor || !de || !para) {
            return res.status(400).json({erro: "Parâmetro inválido"})
        }
        console.log(`Fazendo requisição API: ${de} -> ${para}, valor: ${valor}`)
        const url = `http://api.exchangerate.host/convert?access_key=${API_KEY}&from=${de}&to=${para}&amount=${valor}`
        console.log("URL DA API", url)

        const resposta = await fetch(url)
        const dados = await resposta.json()

        console.log("Resposta da API", dados)

        if(!dados.success) {
            throw new Error(`Erro na API ${dados.error?.info || "Erro desconhecido"}`)
        }
        res.json({
            valorConvertido: dados.result
        })
    } catch(erro) {
        console.error("Erro detalhado", erro)
        res.status(500).json({
            erro:"Erro ao converter moeda",
            detalhes: erro.message
        })
    }
})
app.listen(porta, () => {
    console.log(`Servidor rodando em: http://localhost:${porta}`)
})
