const express = require('express');
const router = express.Router();

const cartController = require('../app/controllers/CartController');

router.post('/:id', cartController.create); // Add product to cart

router.get('/:id/down', cartController.down);

router.get('/:id/up', cartController.up);

router.get('/:id/delete', cartController.delete);

router.get('/checkout', cartController.checkout);

router.get('/', cartController.show);

module.exports = router;