const mongoose = require("mongoose");

const plantaEsquema = new mongoose.Schema({
	Nombre: { type: String },
	Referencia: { type: String, required: true },
	Tamaño: { type: String },
	Stock: Number,
	Activo: Boolean,
	Precio: [Number],
	Foto: [String],
});
module.exports = mongoose.model("Planta", plantaEsquema);
