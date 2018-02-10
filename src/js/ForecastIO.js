import $ from 'jquery';
import Bing from './BingLocation';
import Config from './config';

class ForecastIO {
  constructor() {
    this.provider = 'forecast.io';
    this.apiKey = Config.forecast;
    this.weather = {
      unit: '°C',
      provider: 'forecast.io',
    };
  }

  refreshWeather(lat, lon, callback) {
    const url = `https://api.darksky.net/forecast/${this.apiKey}/${lat},${lon}`;
    $.ajax({
      url,
      dataType: "jsonp",
      success: result => {
        const cur = result.currently;
        Bing.getLocation(lat, lon, location => {
          this.weather.temperatureF = cur.temperature;
          this.weather.temperatureC = ((cur.temperature - 32) / 1.8).toFixed(1);
          this.weather.temperature = this.weather.temperatureC;

          this.weather.code = cur.icon; // result.weather[0].id;
          this.weather.city = location
                                .resourceSets[0]
                                .resources[0]
                                .address
                                .locality; // result.name;
          this.weather.country = location
                                .resourceSets[0]
                                .resources[0]
                                .address
                                .countryRegion; // result.sys.country;
          this.weather.description = cur.summary;

          callback(this.weather, undefined);
        });
      },
      error: err => {
        console.log('AJAX Errorr: ', err);
        callback(undefined, err);
      },
    });
  }
}

export default new ForecastIO();
