const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require('dotenv/config')

const validarHash = async (contrasena, hashExistente) => {
  const hash = await bcrypt.compare(contrasena, hashExistente);
  return hash;
};

const SECRET_KEY_JWT = process.env.SECRET_KEY_JWT;

const verificacionSesion = (request, response, next) => {
  const accessToken = request.cookies.access_token;

  if (!accessToken) {
    refrescarToken(request, response);
    return next()
  }

  // se envia cuando hay access token aunque recordemos que podemos eliminar lo del response y solo usar return por lo de la validacion en la ruta
  try {
    const decodeToken = jwt.verify(accessToken, SECRET_KEY_JWT);
    if (!decodeToken) return response.status(401).json({ acceso: false });
    request.usuario = {
      id: decodeToken.id,
      nombre_usuario: decodeToken.nombre_usuario,
    };
    next()
  } catch {
    return response.status(403).json({ acceso: false });
  }
};

const refrescarToken = (request, response) => {
  const tokenRefrescado = request.cookies.refresh_token;
  if (!tokenRefrescado) return false 

  try {
    const coincideToken = jwt.verify(
      tokenRefrescado,
      SECRET_KEY_JWT
    );
    if (!coincideToken) return false
    // Si coincide, generamos un nuevo Token de refresco
    const usuario = {
      id: coincideToken.id,
      nombre_usuario: coincideToken.nombre_usuario,
    };

    const { accessToken, refreshToken } = crearTokens(usuario);

    if (!accessToken && !refreshToken) return false
    // almacenamos los tokens si todo esta bien
    response
      .cookie("access_token", accessToken, {
        httpOnly: true,
        sameSite: "none",
        secure: true,
        maxAge: 3600000,
      })
      .cookie("refresh_token", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 1000 * 60 * 60 * 24 * 7,
      });

      request.usuario = usuario
      return true
  } catch {
    return false
  }
};

const crearTokens = (informacionUsuario) => {
  let refreshToken = undefined;
  let accessToken = undefined;

  try {
    accessToken = jwt.sign(informacionUsuario, SECRET_KEY_JWT, {
      expiresIn: "1h",
    });

    refreshToken = jwt.sign(informacionUsuario, SECRET_KEY_JWT, {
      expiresIn: "7d",
    });

    return { accessToken, refreshToken };
  } catch {
    refreshToken = false;
    accessToken = false;
    return { accessToken, refreshToken };
  }
};

const verificadorDeTiposProducto = (producto) => {
    const expresion = /^[A-Za-z\s]+$/
    const expresionEnteros = /^[0-9]+$/
    const expresionPrecios = /^[0-9]+(\.[0-9]+)?$/

    if (!expresion.test(producto.nombre) ||
        !expresionEnteros.test(producto.existente) ||
        !expresionEnteros.test(producto.actual) ||
        !expresionEnteros.test(producto.vendido) ||
        !expresionPrecios.test(producto.precio_unidad)
    ) {
        return false
    } else {
        return true
    }
}



module.exports = {
  validarHash,
  verificacionSesion,
  crearTokens,
  verificadorDeTiposProducto
};
