const express = require('express');
const router = express.Router();

var multer  = require('multer');
var upload = multer({ dest: 'src/resources/public/images/'});


const staffController = require('../app/controllers/StaffController');

router.get('/create', staffController.create); // CREATE
router.post('/create', staffController.store);

router.get('/:id/edit', staffController.edit); // UPDATE
router.put('/:id', upload.single('image'), staffController.update);

router.get('/orders/:id', staffController.order);

module.exports = router;