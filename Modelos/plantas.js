const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const plantaEsquema = new mongoose.Schema({
	Nombre: { type: String, required: true },
	Referencia: { type: String, required: true, unique: true },
	Tamaño: { type: String },
	Stock: Number,
	Activo: Boolean,
	Precio: [Number],
	Foto: { type: String, required: true },
});
plantaEsquema.plugin(uniqueValidator);
module.exports = mongoose.model("Planta", plantaEsquema);
