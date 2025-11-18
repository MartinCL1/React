const express = require('express');
const { buscarUsuario } = require('../../db_conexion');
const login = express.Router()

login.post('/', async (request, response) => {
    const informacion = await buscarUsuario('martin')
    console.log(informacion)

    response.send('hola mundo')
})

module.exports = login