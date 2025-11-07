const { create } = require('connect-mongo');
const Product = require('../models/Product');

exports.list = async (req, res) => {
    const productos = await Product.find().sort({createdAt: -1});
};