const express = require('express');
const router = express.Router();

const AuthMiddleware = require('../app/middlewares/AuthMiddleware');
const RoleMiddleware = require('../app/middlewares/RoleMiddleware');
const billController = require('../app/controllers/BillController');

router.get('/:id/view', AuthMiddleware.auth, RoleMiddleware.admin, billController.view);

module.exports = router;