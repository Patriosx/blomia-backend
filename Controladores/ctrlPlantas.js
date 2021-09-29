const mongoose = require("mongoose");
const Plantas = require("../Modelos/plantas");

const agregarNuevaPlanta = async (req, res, next) => {
	try {
		//Buscamos la planta por si ya existe
		respuesta = await Plantas.findOne({ Nombre: req.body.Nombre });
	} catch (error) {
		E = new Error("Fallo en la busqueda");
		E.code = 422;
		return next(E);
	}

	const nuevaPlanta = new Plantas(req.body);
	if (respuesta) {
		E = new Error("Ya existe esta planta");
		E.code = 422;
		return next(E);
	} else {
		try {
			await nuevaPlanta.save();
		} catch (error) {
			E = new Error("No se pudo guardar");
			E.code = 500;
			return next(E);
		}
	}
	res.json({ nuevaPlanta });
};
const obtenerPlantas = async (req, res, next) => {
	try {
		respuesta = await Plantas.find({});
	} catch (error) {
		E = new Error("Fallo en la busqueda");
		E.code = 422;
		return next(E);
	}
	res.json({ respuesta });
};
const obtenerPlantaPorNombre = async (req, res, next) => {
	try {
		respuesta = await Plantas.findOne({ Nombre: req.params.nombre });
	} catch (error) {
		E = new Error("Fallo en la busqueda");
		E.code = 422;
		return next(E);
	}
	respuesta ? res.json({ respuesta }) : res.send("No se encontró esta planta");
};
const eliminarPlanta = async (req, res, next) => {
	try {
		elimina = await Plantas.findByIdAndDelete(req.params);
	} catch (error) {
		E = new Error("Fallo en la busqueda");
		E.code = 404;
		return next(E);
	}
	res.send("Planta eliminada");
};

const cambiarActivo = async (req, res, next) => {
	try {
		respuesta = await Plantas.findById(req.params);
	} catch (error) {
		E = new Error("Fallo en la busqueda. Intentalo otra vez");
		E.code = 404;
		return next(E);
	}
	try {
		respuesta.Activo = !respuesta.Activo;
		respuesta.save();
	} catch (error) {
		E = new Error("No se pudo guardar. Intentalo de nuevo");
		E.code = 500;
		return next(E);
	}
	// res.json({ respuesta });
	res.send(`Actualizado: Activo = ${respuesta.Activo}`);
};
/*****************************************
 * TODO
 * Metodos:

 * - Modificar planta
 */
exports.agregarNuevaPlanta = agregarNuevaPlanta;
exports.obtenerPlantas = obtenerPlantas;
exports.obtenerPlantaPorNombre = obtenerPlantaPorNombre;
exports.eliminarPlanta = eliminarPlanta;
exports.cambiarActivo = cambiarActivo;
