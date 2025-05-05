const express = require('express');
const OnlineController = require('../controller/OnlineController');
const router = express.Router();

router
    .get('/online', OnlineController.getAllPeople)
    .get('/online/:id', OnlineController.getById)
    .post('/online', OnlineController.create)
    .put('/online/:id', OnlineController.updateById)
    .delete('/online/:id', OnlineController.deleteById)

module.exports = router;