import $ from 'jquery';
const jQuery = $;
// export for others scripts to use
window.$ = $;
window.jQuery = jQuery;
var lastValues;

function showValuesFcIo(weather) {
  $('#weathericon').removeClass().addClass(`wi wi-owm-${weather.code}`);
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
  $('#temperature').text(weather.temperature + (weather.unit || "°C"));
  // Show weather description below icon
  $('#weatherdescription').text(weather.description);
  // setWallpaper(weather.code);
    showValuesFcIo(weather);
}

function refreshWeather(lat, lon, cb) {
  fetch(`api/weather/${lat}/${lon}`)
     .then(response => response.json())
     .then(result => cb(result))
     .catch(err => console.error(err));
}

// When ready show weather
$(document).ready(() => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      position => refreshWeather(
              position.coords.latitude,
              position.coords.longitude,
              (w) => {
                lastValues = w;
                $('.spinner').hide();
                $('.content').show();
                showValues(w);
              }),
      err => {
        $('.spinner').hide();
        $('.error').show();
      }
    );
  } else {
    console.error('Geolocation failed!');
  }
  // Temperature Button Click
  $('#buttonCelsius').click(() => {
    lastValues.unit = '°C';
    $('#buttonCelsius').toggleClass('active', true);
    $('#buttonFahrenheit').toggleClass('active', false);
    lastValues.temperature = lastValues.temperatureC;
    showValues(lastValues);
  });
  $('#buttonFahrenheit').click(() => {
    lastValues.unit = '°F';
    $('#buttonCelsius').toggleClass('active', false);
    $('#buttonFahrenheit').toggleClass('active', true);
    lastValues.temperature = lastValues.temperatureF;
    showValues(lastValues);
  });
});
