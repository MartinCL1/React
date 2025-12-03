const express = require('express')
const { verificacionSesion, verificadorDeTiposProducto } = require('../global')
const { eliminarRegistros, agregarProducto, editarProducto, paginarDatos } = require('../../db_conexion')
const principal = express.Router()

principal.use(verificacionSesion);

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
    if(!producto) return response.status(401).json({acceso: false, informacion: false})
    const formatoInformacionValida = verificadorDeTiposProducto(producto)

    if(!formatoInformacionValida) return response.status(400).json({acceso: false, informacion: false});

    const valor = await editarProducto(producto);
    if (!valor) return response.status(403).json({ acceso: false });
    response.status(200).json({ acceso: true, informacion: valor })
})

principal.post('/agregarProducto', verificacionSesion, async (request, response) => {
    const usuario = request.usuario;
    if (!usuario) return response.status(403).json({ acceso: false });

    const productoNuevo = request.body;
    
    const formatoInformacionValida = verificadorDeTiposProducto(productoNuevo);
    if(!formatoInformacionValida) return response.status(400).json({acceso: false, informacion: false});

    const producto = await agregarProducto(productoNuevo);
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