const mongoose = require("mongoose");

const usuarioEsquema = new mongoose.Schema({
	Nombre: { type: String, required: true },
	Password: { type: String, required: true },
	Tipo: { type: String },
});

module.exports = mongoose.model("Usuario", usuarioEsquema);
