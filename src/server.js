import 'dotenv/config'
import express from 'express'
import UserController from "./app/controllers/UserController";

const app = express()
app.use(express.json())

app.post('/users', UserController.store)

app.listen(process.env.PORT, () => {
    console.log(`Servidor rodando em ${process.env.PORT}`)
})