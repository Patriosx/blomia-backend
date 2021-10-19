require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");

app.use(cors());
app.use(express.json());

/**  RUTAS **/
const plantas = require("./Rutas/ruta_planta");
app.use("/plantas", plantas);
const usuarios = require("./Rutas/ruta_usuario");
app.use("/usuarios", usuarios);

// app.use("/public", express.static(`${__dirname}/storage`));
/**  Gestión de errores **/
// Si no encuentra las rutas.
app.use((req, res, next) => {
	res.status(404);
	res.send("No se encontró nada");
});

app.use((error, req, res, next) => {
	if (res.headersSent) {
		// Si ya se ha enviado una respuesta desde el servidor
		return next(error); // seguimos para adelante
	}
	res.status(error.code || 500); // Proporciona código de error y si no hay proporciona el código 500.
	res.json({
		mensaje: error.message || "Ha ocurrido un error desconocido",
	});
});
// Conexión al servidor de MongoDB y, si tiene éxito, al servidor de express
mongoose
	.connect(process.env.MONGO_DB_URI, { useUnifiedTopology: true, useNewUrlParser: true })
	.then(() => {
		app.listen(process.env.PORT, () => console.log("Escuchando en puerto 5000"));
	})
	.catch((error) => console.log(error));
