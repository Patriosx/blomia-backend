const express = require("express");
const router = express.Router();
const ctrl = require("../Controladores/ctrlPlantas");

router.post("/", ctrl.agregarNuevaPlanta);
router.get("/", ctrl.obtenerPlantas);
router.get("/buscar/:nombre", ctrl.obtenerPlantaPorNombre);
router.delete("/eliminar/:_id", ctrl.eliminarPlanta);
router.get("/activo/:_id", ctrl.cambiarActivo);
router.get("/comprobar/:ref", ctrl.comprobarGuardado);
module.exports = router;
