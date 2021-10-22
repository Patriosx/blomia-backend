const express = require("express");
const router = express.Router();
const ctrl = require("../Controladores/ctrlPlantas");
const comprobarAutorizacion = require("../Middleware/check-auth");

router.get("/", ctrl.obtenerPlantas);
router.get("/buscar/:nombre", ctrl.obtenerPlantaPorNombre);
router.get("/activo/:_id", ctrl.cambiarActivo);
router.patch("/stock/:_id", ctrl.modificarStock);

router.use(comprobarAutorizacion);
/** Zona restrigida **/
router.post("/", ctrl.agregarNuevaPlanta);
router.get("/comprobar/:ref", ctrl.comprobarGuardado);
router.delete("/eliminar/:_id", ctrl.eliminarPlanta);
router.patch("/modificar/:_id", ctrl.modificarPlanta);
module.exports = router;
