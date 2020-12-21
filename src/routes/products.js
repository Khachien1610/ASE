const express = require('express');
const router = express.Router();

const multer  = require('multer');
const upload = multer({ dest: 'src/resources/public/images/'});

const ProductController = require('../app/controllers/ProductController');
const RoleMiddleware = require('../app/middlewares/RoleMiddleware');
const AuthMiddleware = require('../app/middlewares/AuthMiddleware');

router.get('/create', ProductController.create); // CREATE
router.post('/store', upload.array('images', 5), ProductController.store);  

router.get('/:slug', AuthMiddleware.authL, RoleMiddleware.roleL, ProductController.show); // READ

router.get('/:id/edit', ProductController.edit); // UPDATE
router.put('/:id', upload.array('images', 5), ProductController.update);

router.delete('/:id', ProductController.delete); // DELETE
router.patch('/:id/restore', ProductController.restore); 
router.delete('/:id/force', ProductController.forceDelete);


module.exports = router;