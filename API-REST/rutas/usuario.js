const express = require('express');
const router = express.Router();

const UsuarioController = require('../controladores/usuario.js');
//Rutas prueba
router.get("/ruta-de-prueba" , UsuarioController.prueba);
router.get("/datos-empresa" , UsuarioController.datosEmpresa);
router.post("/crear-usuario" , UsuarioController.crear);
router.get("/listar-usuarios", UsuarioController.listar);
router.get("/user/:id", UsuarioController.obtenerUsuarioId);

router.post("/userLogin/", UsuarioController.loginUsuario);
router.post("/userLogout/", UsuarioController.logoutUsuario);

router.get("/cookie/:id/", UsuarioController.obtenerCookie);


router.get("/aulas/", UsuarioController.getAulas);

module.exports = router;
