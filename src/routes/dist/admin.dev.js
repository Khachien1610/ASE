"use strict";

var express = require('express');

var router = express.Router();

var adminController = require('../app/controllers/AdminController');

router.get('/stored/products', adminController.storedProducts);
router.get('/trash/products', adminController.trashProducts);
router.get('/stored/accounts', adminController.storedAccounts);
router["delete"]('/accounts/:id', adminController.accountsDelete);
router.patch('/accounts/:id/restore', adminController.accountsRestore);
router["delete"]('/accounts/:id/force', adminController.accountsForeceDelete);
router.get('/trash/accounts', adminController.trashAccounts);
router.get('/', adminController.home);
module.exports = router;