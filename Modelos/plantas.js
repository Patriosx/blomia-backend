const mongoose = require("mongoose");

const plantaEsquema = new mongoose.Schema({
	Nombre: String,
	Referencia: String,
	Tamaño: String,
	Stock: Number,
	Activo: Boolean,
	Tipo: String,
	Precio: Number,
	FotoUrl: String,
});

plantaEsquema.methods.establecerImagen = function establecerImagen(imagen) {
	this.FotoUrl = `http://http://localhost:5000/public/${imagen}`;
};
module.exports = mongoose.model("Planta", plantaEsquema);
