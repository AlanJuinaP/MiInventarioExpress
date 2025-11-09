const path = require('path');
const Product = require('../models/Product');

module.exports = {
  // Listar productos
    list: async (req, res) => {
        try {
            const products = await Product.find().sort({ createdAt: -1 });
            res.render('products/list', { products });
        } catch (err) {
            console.error(err);
            res.status(500).send('Error al listar productos');
        }
    },

    // Mostrar formulario crear
    showCreateForm: (req, res) => {
        res.render('products/form', {
            action: '/products/create',
            method: 'POST',
            product: {},
        });
    },

    // Crear producto
    create: async (req, res) => {
        try {
            const { nombre, precio, descripcion } = req.body;
            let imagen = '';
            if (req.file) {
            // Guardar la ruta pública (no la absoluta)
                imagen = '/uploads/' + req.file.filename;
            }
            const product = new Product({ nombre, precio, descripcion, imagen });
            await product.save();
            res.redirect('/products');
        } catch (err) {
        console.error(err);
        res.status(500).send('Error al crear producto');
        }
    },

    // Mostrar formulario de edición
    showEditForm: async (req, res) => {
        try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).send('Producto no encontrado');
        res.render('products/form', {
            action: `/products/edit/${product._id}`,
            method: 'POST',
            product,
        });
        } catch (err) {
            console.error(err);
            res.status(500).send('Error al obtener producto');
        }
    },

    // Editar producto
    edit: async (req, res) => {
        try {
            const { nombre, precio, descripcion } = req.body;
            const product = await Product.findById(req.params.id);
            if (!product) return res.status(404).send('Producto no encontrado');

            product.nombre = nombre;
            product.precio = precio;
            product.descripcion = descripcion;
            if (req.file) {
                product.imagen = '/uploads/' + req.file.filename;
            }

            await product.save();
            res.redirect('/products');
            } catch (err) {
                console.error(err);
                res.status(500).send('Error al editar producto');
            }
        },

    // Eliminar producto
    remove: async (req, res) => {
        try {
            await Product.findByIdAndDelete(req.params.id);
            res.redirect('/products');
        } catch (err) {
            console.error(err);
            res.status(500).send('Error al eliminar producto');
        }
    },
};
