require('dotenv').load();

const config = {};

config.bingKey = process.env.BING_KEY;
config.forecastIoKey = process.env.FORECAST_KEY;
config.openWeatherMapKey = process.env.OPENWEATHERMAP_KEY;
config.nodeEnv = process.env.NODE_ENV || 'development';
config.corsDomains =  process.env.CORS_DOMAINS ? process.env.CORS_DOMAINS.split(";") : ['http://localhost:5000'];
config.basePath = process.env.BASEPATH || '';

module.exports = config;
