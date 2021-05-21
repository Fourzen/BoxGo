import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';

import { Order } from '../../order.model';

declare var google: any;

@Component({
    selector: 'app-show-map',
    templateUrl: './show-map.component.html',
    styleUrls: ['./show-map.component.scss'],
})
export class ShowMapComponent implements OnInit, AfterViewInit {

    @ViewChild('map', { static: true }) mapElement: ElementRef;
    @Input() center: {lat: number, lng: number};
    @Input() mode: 'endPoint' | 'route';
    @Input() order: Order;
    @Input() myPosition: {lat: number, lng: number};
    googleMaps: any;

    constructor(
        private modalCtrl: ModalController,
        private toastCtrl: ToastController
        ) {
    }

    ngOnInit() {

    }

    ngAfterViewInit() {
       if (this.mode === 'endPoint')
       {
           const map = new google.maps.Map(
              this.mapElement.nativeElement,
               {
                   zoom: 18,
                   center: this.center
               }
           );
           ShowMapComponent.addMarker(this.center.lat, this.center.lng, 'finish', map);
       }
       else {
            this.showDistance(this.myPosition, this.center);
       }

    }


    onExit() {
        this.modalCtrl.dismiss();
    }

    showDistance(myPos: {lat: number, lng: number}, endPoint: {lat: number, lng: number}){
        const avg = {
            lat: (myPos.lat + endPoint.lat) / 2,
            lng: (myPos.lng + endPoint.lng) / 2,
        };

        const directionsService = new google.maps.DirectionsService();
        const directionsDisplay = new google.maps.DirectionsRenderer();
        const map = new google.maps.Map(
            this.mapElement.nativeElement,
            {
                zoom: 7,
                center: avg
            });
        directionsDisplay.setMap(map);

        directionsService.route({
            origin: {lat: myPos.lat, lng: myPos.lng},
            destination: {lat: endPoint.lat, lng: endPoint.lng},
            travelMode: 'DRIVING'
        }, (response, status) => {
            if (status === 'OK') {
                directionsDisplay.setDirections(response);
            }
            else {
                this.toastCtrl.create({
                    message: status
                }).then(toastEl => toastEl.present());
            }
        });

    }

    private static addMarker(lat: number, lng: number, title: string, map: any) {
        const position = new google.maps.LatLng(lat, lng);

        const myMapMarker = new google.maps.Marker({
            position,
            title,
            animation: google.maps.Animation.DROP,
            map
        });
    }

}
