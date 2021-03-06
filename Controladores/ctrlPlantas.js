const mongoose = require("mongoose");
const Plantas = require("../Modelos/plantas");
const cloudinary = require("cloudinary").v2;

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
	respuesta ? res.json({ respuesta }) : res.send("Server: No se encontrĂ³ esta planta");
};
const eliminarFotoVieja = async (req, res, next) => {
	let public_id = req.params.fotoId;
	cloudinary.config({
		cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
		api_key: process.env.CLOUDINARY_API_KEY,
		api_secret: process.env.CLOUDINARY_API_SECRET,
	});
	try {
		cloudinary.uploader.destroy(public_id, function (result) {
			console.log(result);
		});
	} catch (error) {
		E = new Error("Server: Error al eliminar la foto de cloudinary");
		E.code = 500;
		return next(E);
	}
	res.send("Cloudinary: Foto eliminada");
};
const eliminarPlanta = async (req, res, next) => {
	let public_id = "";
	cloudinary.config({
		cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
		api_key: process.env.CLOUDINARY_API_KEY,
		api_secret: process.env.CLOUDINARY_API_SECRET,
	});
	try {
		elimina = await Plantas.findOne(req.params);
		public_id = elimina.Foto[1];
		cloudinary.uploader.destroy(public_id, function (result) {
			console.log(result);
		});
		elimina.remove();
	} catch (error) {
		console.log(error);
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

const modificarPlanta = async (req, res, next) => {
	const { Nombre, Referencia, TamaĂ±o, Activo, Stock, Precio, Foto } = req.body;

	try {
		planta = await Plantas.findById(req.params);
		existeReferencia = await Plantas.findOne({ Referencia });
	} catch (error) {
		console.log(error);
		E = new Error("Server: Fallo en la busqueda. Intentalo otra vez");
		E.code = 404;
		return next(E);
	}

	if (existeReferencia && existeReferencia.Referencia !== planta.Referencia) {
		const err = new Error("Server: Ya existe una planta con esta referencia");
		err.code = 500; // Internal Server Error
		return next(err);
	}
	planta.Nombre = Nombre ? Nombre : planta.Nombre;
	planta.Referencia = Referencia ? Referencia : planta.Referencia;
	planta.TamaĂ±o = TamaĂ±o ? TamaĂ±o : planta.TamaĂ±o;
	// planta.Activo = Activo ? Activo : planta.Activo;
	planta.Stock = Stock ? Stock : planta.Stock;
	planta.Precio = Precio ? Precio : planta.Precio;
	planta.Foto = Foto ? Foto : planta.Foto;
	//Array precio controlado en frontend en el componente Editar
	try {
		planta.save();
	} catch (error) {
		const err = new Error("Server: No se ha podido guardar la informaciĂ³n actualizada");
		err.code = 500; // Internal Server Error
		return next(err);
	}
	console.log("backend: Planta modificada");
	// Devolvemos mensaje de estado OK y el usuario modificado.
	res.status(200).json({
		planta_actualizada: planta,
	});
};

const modificarStock = async (req, res, next) => {
	try {
		planta = await Plantas.findById(req.params);
	} catch (error) {
		E = new Error("Server: Fallo en la busqueda. Intentalo otra vez");
		E.code = 404;
		return next(E);
	}

	const { Stock } = req.body;
	planta.Stock = Stock;

	try {
		planta.save();
	} catch (error) {
		const err = new Error("Server: No se ha podido guardar la informaciĂ³n actualizada");
		err.code = 500; // Internal Server Error
		return next(err);
	}
	console.log("backend: Stock actualizado");
	// Devolvemos mensaje de estado OK y el usuario modificado.
	res.status(200).json({
		planta_actualizada: planta,
	});
};
/*****************************************
 * TODO
 * Metodos:

 */
exports.agregarNuevaPlanta = agregarNuevaPlanta;
exports.obtenerPlantas = obtenerPlantas;
exports.obtenerPlantaPorNombre = obtenerPlantaPorNombre;
exports.eliminarPlanta = eliminarPlanta;
exports.cambiarActivo = cambiarActivo;
exports.comprobarGuardado = comprobarGuardado;
exports.modificarPlanta = modificarPlanta;
exports.modificarStock = modificarStock;
exports.eliminarFotoVieja = eliminarFotoVieja;
