const express = require("express");
const router = express.Router();
const ctrl = require("../Controladores/ctrlPlantas");
const comprobarAutorizacion = require("../Middleware/check-auth");

router.post("/", ctrl.agregarNuevaPlanta);
router.get("/", ctrl.obtenerPlantas);
router.get("/buscar/:nombre", ctrl.obtenerPlantaPorNombre);
router.get("/activo/:_id", ctrl.cambiarActivo);
router.get("/comprobar/:ref", ctrl.comprobarGuardado);

/** Zona restrigida **/
router.use(comprobarAutorizacion);
router.delete("/eliminar/:_id", ctrl.eliminarPlanta);
router.patch("/modificar/:_id", ctrl.modificarPlanta);
module.exports = router;
