const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    nombre: { type: String, require: true},
    precio: { type: Number, required: true },
    escripcion: { type: String, default: '' },
    imagen: { type: String, default: '' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Product', productSchema);