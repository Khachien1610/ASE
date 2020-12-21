const express = require('express');
const router = express.Router();

const adminController = require('../app/controllers/AdminController');

router.get('/stored/products', adminController.storedProducts); // List product
router.get('/trash/products', adminController.trashProducts); // List product delete

router.get('/stored/accounts', adminController.storedAccounts); // List account
router.get('/trash/accounts', adminController.trashAccounts); // List account delete

router.get('/stored/staffs', adminController.storedStaffs); // List staff

router.get('/stored/customers', adminController.storedCustomers); // List customer

router.get('/stored/providers', adminController.storedProviders); // List provider
router.get('/trash/providers', adminController.trashProviders); // List provider delete

router.get('/', adminController.home);

module.exports = router;