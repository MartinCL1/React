const express = require('express')
const { verificacionSesion } = require('../global')
const {obtenerProductos, eliminarRegistros, agregarProducto, editarProducto} = require('../../db_conexion')
const principal = express.Router()

principal.use(verificacionSesion);

principal.get('/', verificacionSesion, async (request, response) => {
    const usuario = request.usuario;
    if (!usuario) return response.status(403).json({ acceso: false });

    const productos = await obtenerProductos();  
    return response.status(200).json({ acceso: true, informacion: productos })
})

principal.delete('/', verificacionSesion, async (request, response) => {
    const usuario = request.usuario;
    if (!usuario) return response.status(403).json({ acceso: false });  

    const { id } = request.body;
    if (!id || id.length > 10) return response.status(400).json({ acceso: false });
    
    const producto = await eliminarRegistros(id);
    if (!producto) return response.status(404).json({ acceso: false });
    response.status(200).json({ acceso: true, informacion: producto })
})

principal.put('/actualizarProducto', async(request, response) => {
    const usuario = request.usuario;
    if(!usuario) return response.status(403).json({acceso: false});

    const producto = request.body
    const valor = await editarProducto(producto);
    if(!valor) return response.status(403).json({acceso: false});
    response.status(200).json({acceso: true, informacion: valor})
})

principal.post('/agregarProducto', verificacionSesion, async (request, response) => {
    const usuario = request.usuario;
    if (!usuario) return response.status(403).json({ acceso: false });

    const { id, nombre, precio_unidad, existente, actual, vendido } = request.body;
    if (!id || !nombre || !precio_unidad || !existente || !actual || !vendido) return response.status(400).json({ acceso: false });
    
    const producto = await agregarProducto({id, nombre, precio_unidad, existente, actual, vendido});
    if (!producto) return response.status(404).json({ acceso: false });
    response.status(200).json({ acceso: true, informacion: producto })
})

module.exports = {
    principal
}