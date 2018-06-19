const config = require('../config');
const fetch = require('node-fetch');
const locationProvider = require('../provider/BingLocation');

class ForecastIO {
  GetWeather(lat, lon) {

    return locationProvider.GetLocation(lat, lon)
      .then(location => {
      
        const url = `https://api.darksky.net/forecast/${config.forecastIoKey}/${lat},${lon}`;
        return fetch(url)
          .then(resp => {
            return resp.json();
          })
          .then(respJson => {
            const cur = respJson.currently;
            const tempC = Number(((cur.temperature - 32) / 1.8).toFixed(1));
            return {
              "temperatureF": cur.temperature,
              "temperatureC": tempC,
              "temperature": tempC,
              "code": cur.icon,
              "description": cur.summary,
              "city": location.city,
              "country": location.country,
            };
          });

      })

  }
}

module.exports = new ForecastIO();