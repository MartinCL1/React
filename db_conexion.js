const { createClient } = require('@supabase/supabase-js')

const URL_DATABASE = process.env.URL_DATABASE;
const DATABASE_KEY = process.env.DATABASE_KEY;

const cliente = createClient(URL_DATABASE, DATABASE_KEY)

const buscarUsuario = async (usuario) => {
    try {
        const { data } = await cliente.from('Usuario').select('nombre_usuario, contrasena, id').eq('nombre_usuario', usuario).range(0, 1)
        if (data.length > 0) return data
        return false
    } catch {
        return false
    }
}

// Obtiene todos los productos.
const obtenerProductos = async () => {
    try {
        const { data } = await cliente.from('Producto').select('*')
        if (data.length > 0) return data
        return false
    } catch {
        return false
    }
}

const eliminarRegistros = async (ids) => {
    try {
        const { data } = await cliente.from('Producto').delete().in('id', ids).select()
        if (data.length > 0) return data
        return false
    } catch {
        return false
    }
}

const agregarProducto = async(producto) => {
    try {
        const { data } = await cliente.from('Producto').insert(producto).select()
        if(!data) {
            return false
        }
        return data
    }catch {
        return false
    }
}

module.exports = {
    buscarUsuario,
    obtenerProductos,
    eliminarRegistros,
    agregarProducto
}