const express = require('express')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const login = require('./Routes/autenticacion/login')
const { principal } = require('./Routes/principal/principal')
const app = express()
const PORT = 3500 || process.env.PORT

app.use(cookieParser())
app.use(cors({origin: '*', credentials: true}))
app.use(express.json())

// Rutas
app.use('/login', login );
app.use('/principal', principal);

app.listen(PORT, ()=> {
    console.log('El server esta corriendo en el puerto: ', PORT)
    console.log('-------------------------------------------------------------------------------------------')                  
    console.log('-------------------------------------------------------------------------------------------')
})