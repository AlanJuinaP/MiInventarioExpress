const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// 🔹 Ruta raíz
router.get('/', (req, res) => {
    if (req.session && req.session.user) {
        return res.redirect('/products');
    } else {
        return res.redirect('/login');
    }
});

// 🔹 Login y Logout
router.get('/login', authController.showLogin);
router.post('/login', authController.login);
router.get('/logout', authController.logout);

// 🔹 Inicializar admin (solo desarrollo)
router.get('/init-admin', async (req, res) => {
    try {
        await authController.ensureAdminExists();
        res.send('Usuario admin creado -> user: admin | pass: admin123');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error al inicializar admin');
    }
});

module.exports = router;
