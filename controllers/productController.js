const { create } = require('connect-mongo');
const Product = require('../models/Product');

exports.list = async (req, res) => {
    const productos = await Product.find().sort({createdAt: -1});
    res.render('products/list', {productos});
};

exports.showCreateForm = (req, res) => {
    res.render('products/form', {action: '/products/create', method: 'POST'});
};

exports.create = async (req, res) => {
    const {nombre, precio, descripcion} = req.body;
    const imagen = req.file ?`/uploads/${req.file.filename}` : '';
    const p = new Product({nombre, precio, descripcion, imagen});
    await p.save();
    res.redirect('/products');
};

exports.showEditForm = async (req, res) => {
    const p = await Product.findById(req.params.id);
    if (!p) return res.redirect('/products');
    res.render('products/form', {product: p, action: `/products/edit/${p._id}`, method: 'POST'});
};

exports.edit = async (req, res) => {
    const {nombre, precio, descripcion} = req.body;
    const update = {nombre, precio, descripcion};
    if (req.file) update.imagen = `/uploads/${req.file.filename}`;
    await Product.findByIdAndUpdate(req.params.id, update);
    res.redirect('/products');
};

exports.remove = async (req,res) => {
    await Product.findByIdAndDelete(req.params.id);
    res.redirect('/products');
};