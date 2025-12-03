const express = require('express')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const login = require('./Routes/autenticacion/login')
const { principal } = require('./Routes/principal/principal')
const app = express()
const PORT = 3500 || process.env.PORT

app.use(cookieParser())
app.use(cors({credentials: true, origin: ['http://localhost:5173', 'https://panaben.netlify.app']}))
app.use(express.json())

app.use('/login', login );
app.use('/principal', principal);

app.get('/', (request, response) => {
    response.send('Welcome.')
})

app.listen(PORT, ()=> {
    console.log('El server esta corriendo en el puerto: ', PORT)
})