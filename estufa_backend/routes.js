const bodyParser = require('body-parser');
const express = require('express');

const sensors = require('../routes/Sensor');
const onlinepage = require('../routes/OnlinePage'); // se estiver usando

module.exports = (app) => {
    app.use(bodyParser.json());

    app.use('/sensors', sensors);
    app.use('/onlinepage', onlinepage); // remova essa linha se não precisar
};
