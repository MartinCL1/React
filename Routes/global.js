const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const validarHash = async (contrasena, hashExistente) => {
  const hash = await bcrypt.compare(contrasena, hashExistente);
  return hash;
};

const verificacionSesion = (request, response) => {
  const accessToken = request.cookies.access_token;
  const refreshToken = request.cookies.refreshToken;
  let refrescar = false

  if (!accessToken) {
    refrescar = refrescarToken(refreshToken)
  }

  if(!refrescar) return response.status(403).json({acceso: false}); // ya sea hubo error o no existe refresh token
  // la unica opcion es refrescarlo si no hay error.
  if (refrescar && !accessToken) {
    const usuario = {id: refrescar.id, nombre_usuario: refrescar.nombre_usuario}
    response.usuario = usuario;
    response.cookie('access_token')
  }

  
  try {
    const decodeToken = jwt.verify(accessToken, "MI LLAVE SUPER SECRETAAAA");
    if (!decodeToken) return response.status(401).json({ acceso: false });
    response.usuario = {
      id: decodeToken.id,
      nombreUsuario: decodeToken.nombreUsuario,
    };
    return response.status(200).json({ acceso: true });
  } catch {
    return response.status(403).json({ acceso: false });
  }
};

const refrescarToken = (refreshToken) => {
  let refrescar = false
  if(!refreshToken) return false

  try {
    refrescar = jwt.verify(refreshToken, 'MI LLAVE SUPER SECRETAAAA'); // si no hay error, se devuelve el token para que se guarde.
    return refrescar
  } catch {
    refrescar = false
    return refrescar
  }  

}

const crearTokens = (informacionUsuario) => {
  let refreshToken = undefined
  let accessToken = undefined
  
  try {
    accessToken = jwt.sign(
      informacionUsuario,
      "MI LLAVE SUPER SECRETAAAA",
      { expiresIn: "1h" }
    );

    refreshToken = jwt.sign(
      informacionUsuario,
      "MI LLAVE SUPER SECRETAAAA",
      { expiresIn: "7d" }
    );

    return { accessToken, refreshToken }
  } catch {
    refreshToken = false
    accessToken = false
    return { accessToken, refreshToken }
  }
};

module.exports = {
  validarHash,
  verificacionSesion,
  crearTokens
};
