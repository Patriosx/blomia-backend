const mongoose = require("mongoose");
const Plantas = require("../Modelos/plantas");

const comprobarGuardado = async (req, res, next) => {
	try {
		//Buscamos la planta por si ya existe por su referencia
		respuesta = await Plantas.findOne({ Referencia: req.params.ref });
	} catch (error) {
		E = new Error("Server: Fallo en la busqueda");
		E.code = 422;
		return next(E);
	}
	if (respuesta) {
		// E = new Error("Ya existe esta planta");
		// E.code = 422;
		// return next(E);
		res.send(false);
	}

	res.send(true);
};

const agregarNuevaPlanta = async (req, res, next) => {
	const nuevaPlanta = new Plantas(req.body);

	try {
		await nuevaPlanta.save();
	} catch (error) {
		console.log(error);
		E = new Error("Server: No se pudo guardar");
		E.code = 500;
		return next(E);
	}

	res.json({ nuevaPlanta });
};
const obtenerPlantas = async (req, res, next) => {
	try {
		respuesta = await Plantas.find({});
	} catch (error) {
		E = new Error("Server: Fallo en la busqueda");
		E.code = 422;
		return next(E);
	}
	res.json({ respuesta });
};
const obtenerPlantaPorNombre = async (req, res, next) => {
	try {
		respuesta = await Plantas.findOne({ Nombre: req.params.nombre });
	} catch (error) {
		E = new Error("Server: Fallo en la busqueda");
		E.code = 422;
		return next(E);
	}
	respuesta ? res.json({ respuesta }) : res.send("Server: No se encontró esta planta");
};
const eliminarPlanta = async (req, res, next) => {
	try {
		elimina = await Plantas.findByIdAndDelete(req.params);
	} catch (error) {
		E = new Error("Server: Fallo en la busqueda");
		E.code = 404;
		return next(E);
	}
	res.send("Server: Planta eliminada");
};

const cambiarActivo = async (req, res, next) => {
	try {
		respuesta = await Plantas.findById(req.params);
	} catch (error) {
		E = new Error("Server: Fallo en la busqueda. Intentalo otra vez");
		E.code = 404;
		return next(E);
	}
	try {
		respuesta.Activo = !respuesta.Activo;
		respuesta.save();
	} catch (error) {
		E = new Error("Server: No se pudo guardar. Intentalo de nuevo");
		E.code = 500;
		return next(E);
	}
	// res.json({ respuesta });
	res.send(`Server: Actualizado: Activo = ${respuesta.Activo}`);
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
exports.comprobarGuardado = comprobarGuardado;
