const bodyParser = require('body-parser');
const sensors = require('../routes/Sensor');

module.exports = (app) => {
    app.use(bodyParser.json());
    app.use('/sensors', sensors);
};
