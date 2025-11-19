const { createClient } = require('@supabase/supabase-js')
const bcrypt = require('bcrypt')

const cliente = createClient('https://ouvrbcxtbmsthupeuzyk.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im91dnJiY3h0Ym1zdGh1cGV1enlrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MzQyNjM1OSwiZXhwIjoyMDc5MDAyMzU5fQ.Y1l0480GLSrNwm-RBNrIC7DvZkIgLdUfYc6Z2AFsy14')

const buscarUsuario = async(usuario) => {
    try {
        const { data } = await cliente.from('Usuario').select('nombre_usuario, contrasena, id').eq('id', 1).range(0, 1)
        console.log(data)
        if(data.length > 0) {
            return data
        }
        return false
    } catch {
        return false
    }
}

module.exports = {
    buscarUsuario,
}