const express = require('express')
const { verificacionSesion } = require('../global')
const principal = express.Router()
const {obtenerProductos} = require('../../db_conexion')

principal.use(verificacionSesion);

principal.get('/', async (request, response) => {
    const usuario = request.usuario;
    if (!usuario) return response.status(403).json({ acceso: false });  // Si no hay usuario, no hay acceso ni data.

    const productos = await obtenerProductos();  // Obtenemos los productos.
    return response.status(200).json({ acceso: true, informacion: productos })
})

module.exports = {
    principal
}