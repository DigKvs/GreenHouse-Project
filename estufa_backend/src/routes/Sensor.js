const express = require('express');
const SensorsController = require('../controller/SensorsController');
const router = express.Router();

router
    .get('/', SensorsController.getLatest)
    .get('/:id', SensorsController.getById)
    .post('/', SensorsController.create)
    .put('/:id', SensorsController.updateById)
    .delete('/:id', SensorsController.deleteById)

module.exports = router;
