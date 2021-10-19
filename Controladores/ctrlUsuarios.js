const mongoose = require("mongoose");
const Usuario = require("../Modelos/usuarios");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const altaUsuario = async (req, res, next) => {
	const { Nombre, Password, Tipo } = req.body;

	try {
		respuesta = await Usuario.findOne({ Nombre });
	} catch (error) {
		const err = new Error("Server: Fallo en la busqueda");
		err.code = 500; // Internal Server Error
		return next(err);
	}

	if (respuesta) {
		const error = new Error("Ya existe este usuario");
		error.code = 401; // 401 Fallo de autentificación.
		return next(error);
	} else {
		let hashedPassword;

		try {
			hashedPassword = await bcrypt.hash(Password, 10);
		} catch (error) {
			const err = new Error("Server: No se ha podido crear el usuario. Inténtelo de nuevo");
			err.code = 500; // Internal Server Error
			return next(err);
		}

		const nuevoUsuario = new Usuario({
			Nombre: Nombre.trim(),
			Password: hashedPassword,
			Tipo: Tipo.trim(),
		});

		try {
			await nuevoUsuario.save();
		} catch (error) {
			const err = new Error("Server: No se han podido guardar los datos");
			err.code = 500; // Internal Server Error
			return next(err);
		}

		console.log("Usuario creado.");
	}
	res.send("Server: Usuario creado");
};

const iniciarSesion = async (req, res, next) => {
	const { Nombre, Password } = req.body;

	try {
		existeUsuario = await Usuario.findOne({ Nombre });
		// console.log(existeUsuario);
	} catch (error) {
		const err = new Error("Server: Fallo en la busqueda");
		err.code = 500; // Internal Server Error
		return next(err);
	}
	let passwordValido = false;
	if (!existeUsuario) {
		const error = new Error("Server: No se ha podido identificar al usuario. Credenciales erróneas");
		error.code = 422; // 422: Datos de usuario inválidos
		return next(error);
	} else {
		//si existe el usuario compruebo la contraseña
		try {
			passwordValido = await bcrypt.compare(Password, existeUsuario.Password);
			// console.log(passwordValido);
		} catch (error) {
			const err = new Error("Server: Fallo al iniciar sesión. Intentalo de nuevo");
			err.code = 500; // 500: Internal Server Error.
			return next(error);
		}
	}

	//no coinciden las contraseñas, fallo del usuario
	if (!passwordValido) {
		const error = new Error("Server: No se ha podido identificar al usuario. Credenciales erróneas");
		error.code = 401; // 401: Fallo de autentificación.
		return next(error);
	} else {
		/** Creación del Token **/
		//Al iniciar sesion se creará un token correspondiente al usuario que acaba de acceder al sistema
		let token;
		try {
			token = jwt.sign(
				{
					ID: existeUsuario.id,
					Nombre: existeUsuario.Nombre,
				},
				process.env.JWT_KEY,
				{ expiresIn: "6h" }
			);
		} catch (error) {
			console.log("error", error);

			const err = new Error("Server: No se ha podido iniciar sesión");
			err.code = 500; // Internal Server Error
			return next(err);
		}
		res.json({
			ID: existeUsuario.id,
			Nombre: existeUsuario.Nombre,
			Tipo: existeUsuario.Tipo,
			token: token,
		});
	}
	console.log("Usuario logeado");
};

exports.altaUsuario = altaUsuario;
exports.iniciarSesion = iniciarSesion;
