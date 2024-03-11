const express = require('express')
const app = express()
const bookRoutes = require('./routes/books')
const userRoutes = require('./routes/users')
const mongoose = require('mongoose')
mongoose
    .connect(
        'mongodb+srv://principal_user:2W3p4K37OSoERWez@database.zs9rsve.mongodb.net/?retryWrites=true&w=majority&appName=database',
        { useNewUrlParser: true, useUnifiedTopology: true }
    )
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'))

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'
    )
    res.setHeader(
        'Access-Control-Allow-Methods',
        'GET, POST, PUT, DELETE, PATCH, OPTIONS'
    )
    next()
})

app.use(express.json())

app.use('/api/books', bookRoutes)
app.use('/api/auth', userRoutes)

module.exports = app
