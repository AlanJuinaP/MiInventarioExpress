const express = require('express');
const router = express.Router();
const path = require('path');
const multer = require('multer');
const {body, validationResult} = require('express-validator');

const productController = require('../controllers/productController');
const { isAuthenticated, isAdmin} = require('../middlewares/auth');

const uploadDir = path.join(__dirname, '..', 'public', 'uploads');

//configuracion Multer
const storage = multer.diskStorage({
    destination: function(req,file,cb){
        cb(null, uploadDir);
    },
    filename: function(req, file, cb){
        const unique = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, `${unique}${ext}`);
    }
});

const fileFilter = (req, file, cb) => {
    if (/^image\/(jpeg|png|jpg|webp)$/.test(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Solo se permiten imágenes (jpeg, png, jpg, webp)'), false);
    }
}

const upload = multer({
    storage,
    fileFilter,
    limits: {fileSize: 10*1024*1024} //10 mb
});

//Rutas
router.get('/', isAuthenticated, productController.list);

router.get('/create', isAuthenticated, isAdmin, productController.showCreateForm);
router.post('/create',
    isAuthenticated, 
    isAdmin,
    upload.single('imagen'),
    body('nombre').notEmpty().withMessage('Nombre requerido'),
    body('precio').isFloat({min:0}).withMessage('Precio Invalido'),
    (req, res, next) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.render('products/form', { errors: errors.array(), old: req.body, action: '/products/create', method: 'POST' });
        }
        next();
    },
    productController.create
);

router.get('/edi/:id', isAuthenticated, isAdmin, productController.showEditForm);
router.post('/edit/:id',
    isAuthenticated, 
    isAdmin,
    upload.single('imagen'),
    body('nombre').notEmpty().withMessage('Nombre requerido'),
    body('precio').isFloat({min: 0}).withMessage('Precio Invalido'),
    (req, res, next) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.render('products/form', { errors: errors.array(), old: req.body, action: `/products/edit/${req.params.id}`, method: 'POST' });
        }
        next();
    },
    productController.edit
);

router.post('/delete/:id', isAuthenticated, isAdmin, productController.remove);

module.exports = router;