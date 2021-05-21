import { Injectable } from '@angular/core';
import { Capacitor, Plugins } from '@capacitor/core';
import { environment } from '../../../environments/environment';
import { tap } from 'rxjs/operators';
import { AlertController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { Address } from './address.model';

@Injectable({
    providedIn: 'root'
})
export class LocateService {
    private coords = { lat: 1, lng: 1 };
    private coordsSubject = new BehaviorSubject<{ lat: number, lng: number }>(this.coords);

    constructor(private alertCtrl: AlertController,
                private http: HttpClient) {
    }

    getCoords() {
        return this.coordsSubject.asObservable();
    }

    locateUser() {

        if ( !Capacitor.isPluginAvailable('Geolocation') ) {
            this.showAlert('Could not fetch location', 'Please use the map to pick a location!');
            return;
        }
        Plugins.Geolocation.getCurrentPosition().then(geoPosition => {
            this.coords = { lat: geoPosition.coords.latitude, lng: geoPosition.coords.longitude };
            this.coordsSubject.next(this.coords);
        }).catch(err => {
            this.showAlert('Error to get location', 'Please turn on the location or use the map to pick a location!');
        });

        this.coordsSubject.next(this.coords);
    }

    showAlert(msg: string, header: string) {
        this.alertCtrl.create({
            header,
            message: msg,
            buttons: ['Okey']
        }).then(alertEl => alertEl.present());
    }

    getLatLng(address: Address) {
        return this.http.get(
            `https://maps.googleapis.com/maps/api/geocode/json?address=${address.zip}+${address.city}+${address.street}+
        ${address.number}+HU&key=${environment.mapAPIKey}`
        ).pipe(tap(results => {
            return results;
        }));
    }
}
