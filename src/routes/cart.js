const express = require('express');
const router = express.Router();

const cartController = require('../app/controllers/CartController');

router.post('/:id', cartController.create); // Add product to cart

router.get('/', cartController.show);

module.exports = router;