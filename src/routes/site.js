const express = require('express');
const SiteController = require('../app/controllers/SiteController');
const router = express.Router();

const siteController = require('../app/controllers/SiteController');
const AuthMiddleware = require('../app/middlewares/AuthMiddleware');
const RoleMiddleware = require('../app/middlewares/RoleMiddleware');
const AccountMiddleware = require('../app/middlewares/AccountMiddleware');

router.get('/register', AuthMiddleware.authL, RoleMiddleware.role, siteController.register);

router.post('/register', siteController.postRegister);

router.get('/login', AuthMiddleware.authL, RoleMiddleware.role, siteController.login);

router.post('/login', siteController.postLogin);

router.get('/logout', siteController.logout);

router.get('/infoaccount', AuthMiddleware.auth, RoleMiddleware.roleL, siteController.infoAccount);

router.get('/order', AuthMiddleware.auth, RoleMiddleware.roleL, siteController.order);

router.get('/search', siteController.search);

router.get('/', AuthMiddleware.authL, RoleMiddleware.roleL, siteController.index);


module.exports = router;