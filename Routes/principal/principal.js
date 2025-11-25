const express = require('express')
const { verificacionSesion } = require('../global')
const principal = express.Router()
const {obtenerProductos, eliminarRegistros} = require('../../db_conexion')

principal.use(verificacionSesion);

principal.get('/', verificacionSesion, async (request, response) => {
    const usuario = request.usuario;
    if (!usuario) return response.status(403).json({ acceso: false });  // Si no hay usuario, no hay acceso ni data.

    const productos = await obtenerProductos();  // Obtenemos los productos.
    return response.status(200).json({ acceso: true, informacion: productos })
})

principal.delete('/', verificacionSesion, async (request, response) => {
    const usuario = request.usuario;
    if (!usuario) return response.status(403).json({ acceso: false });  // Si no hay usuario, no hay acceso ni data.

    const { id } = request.body;
    if (!id || id.length > 10) return response.status(400).json({ acceso: false });
    
    const producto = await eliminarRegistros(id);
    if (!producto) return response.status(404).json({ acceso: false });
    response.status(200).json({ acceso: true, informacion: producto })
})
module.exports = {
    principal
}