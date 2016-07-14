import $ from 'jquery';
import Config from './config';

class BingLocation {
  constructor() {
    this.apiKey = Config.bing;
    this.locationInfo = { };
  }

  getLocation(lat, lon, callback) {
    const url = `http://dev.virtualearth.net/REST/v1/Locations/${lat},${lon}?key=${this.apiKey}`;
    $.ajax({
      url,
      success: result => {
        this.locationInfo = result;
        if (callback) callback(this.locationInfo, undefined);
      },
      error: err => {
        console.log('AJAX Errorr: ', err);
        if (callback) callback(undefined, err);
      },
    });
  }
}

export default new BingLocation();
