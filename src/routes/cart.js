const express = require('express');
const router = express.Router();

const cartController = require('../app/controllers/CartController');
const RoleMiddleware = require('../app/middlewares/RoleMiddleware');
const AuthMiddleware = require('../app/middlewares/AuthMiddleware');

router.post('/:id', cartController.create); // Add product to cart

router.get('/:id/down', cartController.down);

router.get('/:id/up', cartController.up);

router.get('/:id/delete', cartController.delete);

router.get('/check/order', AuthMiddleware.authL, RoleMiddleware.roleL, cartController.check);

router.post('/check/order', cartController.checkPost);

router.get('/', AuthMiddleware.authL, RoleMiddleware.roleL, cartController.show);

module.exports = router;