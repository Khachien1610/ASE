const express = require('express');
const router = express.Router();

const providerController = require('../app/controllers/ProviderController');

router.get('/create', providerController.create); // CREATE
router.post('/create', providerController.store);

router.get('/:id/edit', providerController.edit); // UPDATE
router.put('/:id', providerController.update);

router.delete('/:id', providerController.delete); // DELETE
router.patch('/:id/restore', providerController.restore);
router.delete('/:id/force', providerController.foreceDelete); 

module.exports = router;