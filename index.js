const express = require('express')
const cors = require('cors')
require('dotenv').config()


const app = express()
app.use(express.json())
app.use(cors())
const PORT = 3000


app.get('/', (req, res) => {
    console.log('Rota ativa')
    console.log(process.env.GEMINI_API_KEY)
})

// 

app.post('/chat', async (req, res) => {

    const userMessage = req.body.message


    if(!userMessage) {
        return res.sendStatus(400).json({error: "Mensage é obrigatoria"})
    }

    try {

        const apyKey = process.env.GEMINI_API_KEY
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apyKey}`

        const response = await fetch(url,{
            method: "POST",
            headers: { "Content-Type": "application/json"},
            body: JSON.stringify({
                contents: [{ parts: [{ text: userMessage}]}],
            }),
        })

        const data = await response.json()

        const reply = data.candidates?.[0]?.content?.parts?.[0]?.text;

        res.json({ reply: reply || " Sem resposta da IA"})
                    
    } catch (error) {
        console.error('Erro ao conectar com Google IA', error)
        res.status(500).json({error: "Erro de servidor"})
    }
})

app.listen(PORT, () => {
    console.log('Servidor de IA no AR!')
})