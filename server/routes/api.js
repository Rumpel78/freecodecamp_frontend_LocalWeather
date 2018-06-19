const express = require('express');
const weatherProvider = require('../provider/ForecastIO');
var cors = require('cors');
const config = require('../config');

const router = express.Router();

var whitelist = config.corsDomains;
var corsOptions = {
  origin: function (origin, callback) {
    if(config.nodeEnv == 'development'){
      callback(null, true);
    }
    else if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}

/* GET weather wrapper. */
router.get('/weather/:lat/:lon', cors(corsOptions), (req, res) => {

  weatherProvider.GetWeather(req.params["lat"], req.params["lon"])
    .then(weather => {
      res.status(200).send(weather);
    })
    .catch(err => {
      console.log(err);
      res.status(500).send("Error getting weather");
    });

});

module.exports = router;