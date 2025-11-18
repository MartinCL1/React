const express = require('express')
const login = require('./Routes/autenticacion/login')
const app = express()

const PORT = 3500 || process.env.PORT

app.use('/login', login );

app.listen(PORT, ()=> {
    console.log('El server esta corriendo en el puerto: ', PORT)
})