const express = require('express')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const login = require('./Routes/autenticacion/login')
const { principal } = require('./Routes/principal/principal')
const app = express()
const PORT = 3500

app.use(cookieParser())
app.use(cors({credentials: true, origin: ['http://localhost:5173', 'https://panaben.netlify.app']}))
app.use(express.json())

// Rutas
app.use('/login', login );
app.use('/principal', principal);


app.get('/', (req, res) => {
    res.send('Hola Mundo')
})
app.listen(PORT, ()=> {
    console.log('El server esta corriendo en el puerto: ', PORT)
})

