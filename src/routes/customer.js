const express = require('express');
const router = express.Router();

var multer  = require('multer');
var upload = multer({ dest: 'src/resources/public/images/'});

const customerController = require('../app/controllers/CustomerController');

router.get('/:id/edit', customerController.edit); // UPDATE
router.put('/:id',upload.single('image'), customerController.update);

module.exports = router;