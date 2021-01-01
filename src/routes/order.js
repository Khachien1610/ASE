const express = require('express');
const router = express.Router();

const AuthMiddleware = require('../app/middlewares/AuthMiddleware');
const RoleMiddleware = require('../app/middlewares/RoleMiddleware');
const orderController = require('../app/controllers/OrderController');

router.get('/:id', AuthMiddleware.authL, RoleMiddleware.roleL, orderController.show);

router.get('/:id/delete', orderController.delete);

router.get('/:id/process', AuthMiddleware.auth, RoleMiddleware.admin, orderController.process);

router.get('/:id/view', AuthMiddleware.auth, RoleMiddleware.admin, orderController.view);

router.post('/:id/done', AuthMiddleware.auth, RoleMiddleware.admin, orderController.done);

module.exports = router;