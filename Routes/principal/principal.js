const express = require('express')
const { verificacionSesion } = require('../global')
const { eliminarRegistros, agregarProducto, editarProducto, paginarDatos } = require('../../db_conexion')
const principal = express.Router()

principal.use(verificacionSesion);

principal.get('/', (request, response) => {
    response.send('holas')   
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

principal.put('/actualizarProducto', async (request, response) => {
    const usuario = request.usuario;
    if (!usuario) return response.status(403).json({ acceso: false });
    const producto = request.body

    const expresion = /^[A-Za-z]+$/
    const expresionEnteros = /^[0-9]+$/
    const expresionPrecios = /^[0-9]+(\.[0-9]+)?$/


    if (!producto.nombre.match(expresion) ||
        !Number(producto.existente.match(expresionEnteros)) ||
        !Number(producto.actual.match(expresionEnteros)) ||
        !Number(producto.vendido.match(expresionEnteros)) ||
        !parseFloat(producto.precio_unidad.match(expresionPrecios))
    ) {
        return response.status(401).json({ acceso: false })
    }

    const valor = await editarProducto(producto);
    if (!valor) return response.status(403).json({ acceso: false });
    response.status(200).json({ acceso: true, informacion: valor })
})

principal.post('/agregarProducto', verificacionSesion, async (request, response) => {
    const usuario = request.usuario;
    if (!usuario) return response.status(403).json({ acceso: false });

    const { id, nombre, precio_unidad, existente, actual, vendido } = request.body;
    if (!id || !nombre || !precio_unidad || !existente || !actual || !vendido) return response.status(400).json({ acceso: false });

    const producto = await agregarProducto({ id, nombre, precio_unidad, existente, actual, vendido });
    if (!producto) return response.status(404).json({ acceso: false });
    response.status(200).json({ acceso: true, informacion: producto })
})

principal.get('/obtenerData/:pagina', async (request, response) => {
    const usuario = request.usuario
    if (!usuario) return response.status(401).json({ acceso: false })
    const pagina = request.params.pagina
    const idInicial = (pagina * 10) - 10
    const idFinal = (pagina * 10);
    const informacion = await paginarDatos(idInicial, idFinal)
    if (!informacion) return response.status(401).json({ acceso: false });
    response.status(200).json({ acceso: true, informacion: informacion })
})

module.exports = {
    principal
}