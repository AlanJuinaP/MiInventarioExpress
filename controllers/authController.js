const bcrypt = require('bcrypt');
const User = require('../models/User');

module.exports = {
    showLogin: (req, res) => {
        res.render('auth/login', { action: '/login', method: 'POST' });
    },

    login: async (req, res) => {
        try {
            const { username, password } = req.body;
            const user = await User.findOne({ username });
            if (!user) {
                return res.render('auth/login', { error: 'Credenciales inválidas', username });
            }
            const match = await bcrypt.compare(password, user.passwordHash);
            if (!match) {
                return res.render('auth/login', { error: 'Credenciales inválidas', username });
            }
            // guardamos usuario básico en sesión
            req.session.user = { id: user._id, username: user.username, role: user.role };
            res.redirect('/products');
        } catch (err) {
            console.error(err);
            res.status(500).send('Error en login');
        }
    },

    logout: (req, res) => {
        req.session.destroy(err => {
            res.clearCookie('connect.sid');
            res.redirect('/login');
        });
    },

    // helper para crear un admin rápido si no existe (solo para desarrollo)
    ensureAdminExists: async () => {
        const adminUser = await User.findOne({ username: 'admin' });
        if (!adminUser) {
            const pass = 'admin123'; // cambia cuando subas al repo
            const hash = await bcrypt.hash(pass, 10);
            const u = new User({ username: 'admin', passwordHash: hash, role: 'admin' });
            await u.save();
            console.log('Usuario admin creado -> username: admin, password: admin123');
        }
    }
};