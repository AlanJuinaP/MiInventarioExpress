const bcrypt = require('bcrypt');
const User = require('../models/User');

exports.getLogin = (req, res) => {
    res.render('auth/login');
};

exports.postLogin = async (req, res) => {
    const {username, password} = req.body;
    const user = await User.findOne({username});
    if (!user) return res.render('auth/login', {error: 'Usuerio o contraseña incorrectos'});
    const match = await bcrypt.compare(password, user.passwordHash);
    if(!match) return res.render('auth/login', {error: 'Usuario o contraseña incorrectos'});

    req.session.user = {id: user._id, username: user.username, role: user.role};
    res.redirect('/products');
};

exports.logout = (req, res) => {
    req.session.destroy(() => res.redirect('/login'));
};

// creacion de admin (solo dev)
exports.registerAdmin = async(req, res) => {
    const {username, password} = req.body;
    if (!username || !password) return res.status(400).send('username y password requeridos');
    const exists = await User.findOne({ username });
    if (exists) return res.status(400).send('Usuario ya existe');
    const hash = await bcrypt.hash(password, 10);
    const user = new User({ username, passwordHash: hash, role: 'admin' });
    await user.save();
    res.send('Admin creado');
};