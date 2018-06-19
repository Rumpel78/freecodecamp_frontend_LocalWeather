const config = require('../config');
const fetch = require('node-fetch');

class BingLocation {
  GetLocation(lat, lon) {
    const url = `http://dev.virtualearth.net/REST/v1/Locations/${lat},${lon}?key=${config.bingKey}`;
    return fetch(url)
      .then(resp => {
        return resp.json();
      })
      .then(respJson => {
        return {
          "city": respJson.resourceSets[0].resources[0].address.locality, // result.name;
          "country": respJson.resourceSets[0].resources[0].address.countryRegion, // result.sys.country;
        }
      })
  }
}

module.exports = new BingLocation();