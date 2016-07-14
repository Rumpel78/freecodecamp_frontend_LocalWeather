import WeatherApi from './ForecastIO';

import $ from 'jquery';
const jQuery = $;
// export for others scripts to use
window.$ = $;
window.jQuery = jQuery;

function showValuesFcIo(weather) {
  $('#weathericon').removeClass().addClass(`wi wi-forecast-io-${weather.code}`);
  let code = 0;
  switch (weather.code) {
    case 'rain': {
      code = 5;
      if (weather.description === 'Drizzle') {
        code = 3;
      }
      break;
    }
    case 'snow': code = 6; break;
    case 'sleet': code = 6; break;
    case 'hail': code = 6; break;

    case 'fog': code = 7; break;

    case 'wind': code = 8; break;
    case 'cloudy': code = 8; break;
    case 'partly-cloudy-day': code = 8; break;
    case 'partly-cloudy-night': code = 8; break;

    case 'thunderstorm': code = 1; break;
    case 'tornado': code = 1; break;
    default: code = 0;
  }
  $('body').css('background-image', `url("assets/${code}.jpg")`);
}

function showValuesOwm(weather) {
  $('#weathericon').removeClass().addClass(`wi wi-owm-${weather.code}`);
  let code = 0;
  if (weather.code !== 800) {
    code = weather.code.toString()[0];
  }
  $('body').css('background-image', `url("assets/${code}.jpg")`);
}

function showValues(weather) {
  // Show current location with country
  $('#location').text(`${weather.city} (${weather.country})`);
  // Show weather icon
  $('#temperature').text(weather.temperature + weather.unit);
  // Show weather description below icon
  $('#weatherdescription').text(weather.description);
  // setWallpaper(weather.code);
  console.log(weather.provider);
  switch (weather.provider) {
    case 'forecast.io': showValuesFcIo(weather); break;
    case 'openWeatherMap': showValuesOwm(weather); break;
    default: console.error('No provider!');
  }
}

// When ready show weather
$(document).ready(() => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      position => WeatherApi.refreshWeather(
              position.coords.latitude,
              position.coords.longitude,
              (w) => {
                $('.spinner').hide();
                $('.content').show();
                showValues(w);
              })
    );
  } else {
    console.err('Geolocation failed!');
  }
  // Temperature Button Click
  $('#buttonCelsius').click(() => {
    WeatherApi.weather.unit = '°C';
    $('#buttonCelsius').toggleClass('active', true);
    $('#buttonFahrenheit').toggleClass('active', false);
    WeatherApi.weather.temperature = WeatherApi.weather.temperatureC;
    showValues(WeatherApi.weather);
  });
  $('#buttonFahrenheit').click(() => {
    WeatherApi.weather.unit = '°F';
    $('#buttonCelsius').toggleClass('active', false);
    $('#buttonFahrenheit').toggleClass('active', true);
    WeatherApi.weather.temperature = WeatherApi.weather.temperatureF;
    showValues(WeatherApi.weather);
  });
});
