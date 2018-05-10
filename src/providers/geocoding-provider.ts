import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {googleGeocodingApiKey} from '../environments/environment';

@Injectable()
export class GeocodingProvider {
  constructor(public http: HttpClient) {}

  getAddressByCoords(lat: number, lng: number) {
    return new Promise((resolve, reject) => {
      console.log('we came so far');
      this.http.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${googleGeocodingApiKey}`)
        .subscribe((res) => {
          const near = res['results'][1]['formatted_address'];
          if (near !== undefined) {
            resolve(near);
          } else {
            reject();
          }
        }, () => {
          reject();
        });
    });
  }
}
