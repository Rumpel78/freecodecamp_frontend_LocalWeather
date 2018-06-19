const config = require('../config');
const fetch = require('node-fetch');

class ForecastIO {
  GetWeather(lat, lon) {
    const url = `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&APPID=${config.openWeatherMapKey}`;
    return fetch(url)
      .then(resp => {
        return resp.json();
      })
      .then(respJson => {
        const temperatureF = Number(((respJson.main.temp - 273.15) * 1.8 + 32).toFixed(1));
        const temperatureC = Number((respJson.main.temp - 273.15).toFixed(1));
        let code = 0;
        if (result.weather[0].id !== 800) {
            code = result.weather[0].id;
        }
        return {
          "temperatureF": temperatureF,
          "temperatureC": temperatureC,
          "temperature": temperatureC,
          "code": code,
          "description": cur.summary,
          "city": result.name,
          "country": result.sys.country,
          "description": result.weather[0].description,
        };
      });
  }
}

module.exports = new ForecastIO();