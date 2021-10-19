const express = require("express");
const router = express.Router();
const ctrl = require("../Controladores/ctrlUsuarios");

router.post("/", ctrl.altaUsuario);
router.post("/login", ctrl.iniciarSesion);

module.exports = router;
