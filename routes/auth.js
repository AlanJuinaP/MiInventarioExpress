const express =  require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.get('/login', authController.getLogin);
router.post('/login', authController.postLogin);
router.get('/logout', authController.logout);

//ruta que permitira crear admi en desarrollo
router.post('/register-admin', authController.registerAdmin);

module.exports = router;