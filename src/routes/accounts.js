const express = require('express');
const router = express.Router();

const accountController = require('../app/controllers/AccountController');


router.get('/:id', accountController.show); // READ

router.get('/:id/password/edit', accountController.edit);  // UPDATE
router.post('/:id/password/edit', accountController.update);

router.delete('/:id', accountController.accountsDelete); // DELETE
router.patch('/:id/restore', accountController.accountsRestore);
router.delete('/:id/force', accountController.accountsForeceDelete); 

module.exports = router;