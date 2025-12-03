const express = require("express");
const { buscarUsuario } = require("../../db_conexion");
const { validarHash, verificacionSesion, crearTokens } = require("../global");
const login = express.Router();

login.post("/", async (request, response) => {
  const { nombreUsuario, contrasena } = request.body;
  const [usuarioEncontrado] = await buscarUsuario(nombreUsuario.toLowerCase());

  if (!usuarioEncontrado) return response.status(403).json({ acceso: false });
  const esHashValido = await validarHash(
    contrasena,
    usuarioEncontrado.contrasena
  );

  if (!esHashValido) return response.status(401).json({ acceso: false });

  try {
    const usuario = {
      id: usuarioEncontrado.id,
      nombre_usuario: usuarioEncontrado.nombre_usuario,
    };

    const { accessToken, refreshToken } = crearTokens(usuario)

    if (!accessToken && !refreshToken) return response.status(401).json({ acceso: false })

    response
      .cookie("access_token", accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 3600000,
      }).cookie("refresh_token", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 1000 * 60 * 60 * 24 * 7,
      });

    response.usuario = usuario
    return response.status(200).json({ acceso: true });
  } catch {
    return response.status(500).json({ acceso: false });
  }
});

login.get("/", verificacionSesion, (request, response) => {
  const usuario = request.usuario
  if (!usuario) return response.status(403).json({ acceso: false })
  response.status(200).json({ acceso: true })
});

module.exports = { login };