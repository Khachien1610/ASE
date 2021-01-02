const express = require('express');
const router = express.Router();

const multer  = require('multer');
const upload = multer({ dest: 'src/resources/public/images/'});

const productController = require('../app/controllers/ProductController');
const RoleMiddleware = require('../app/middlewares/RoleMiddleware');
const AuthMiddleware = require('../app/middlewares/AuthMiddleware');

router.get('/create', AuthMiddleware.auth, RoleMiddleware.admin, productController.create); // CREATE
router.post('/store', upload.array('images', 5), productController.store);  

router.get('/:slug', AuthMiddleware.authL, RoleMiddleware.roleL, productController.show); // READ

router.get('/:id/edit',AuthMiddleware.auth, RoleMiddleware.admin, productController.edit); // UPDATE
router.put('/:id', upload.array('images', 5), productController.update);

router.delete('/:id', productController.delete); // DELETE
router.patch('/:id/restore', productController.restore); 
router.delete('/:id/force', productController.forceDelete);

module.exports = router;


