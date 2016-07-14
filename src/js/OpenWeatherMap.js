import $ from 'jquery';

class OpenWeatherMap {
  constructor() {
    this.apiKey = '2d44dd77630a959ec742301337bd1387';
    this.weather = {
      unit: '°C',
      provider: 'openWeatherMap',
    };
  }

  refreshWeather(lat, lon, callback) {
    const url = `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&APPID=${this.apiKey}`;
    $.ajax({
      url,
      success: result => {
        this.weather.temperatureF = ((result.main.temp - 273.15) * 1.8 + 32).toFixed(1);
        this.weather.temperatureC = (result.main.temp - 273.15).toFixed(1);
        this.weather.temperature = this.weather.temperatureC;
        this.weather.code = result.weather[0].id;
        this.weather.city = result.name;
        this.weather.country = result.sys.country;
        this.weather.description = result.weather[0].description;
        callback(this.weather, undefined);
      },
      error: err => {
        console.log('AJAX Errorr: ', err);
        callback(undefined, err);
      },
    });
  }
}

export default new OpenWeatherMap();
