const mongoose = require("mongoose");

const plantaEsquema = new mongoose.Schema({
	Nombre: { type: String, required: true },
	Referencia: { type: String, required: true },
	Tamaño: { type: String },
	Stock: Number,
	Activo: Boolean,
	Precio: [Number],
	Foto: { type: String, required: true },
});
module.exports = mongoose.model("Planta", plantaEsquema);
