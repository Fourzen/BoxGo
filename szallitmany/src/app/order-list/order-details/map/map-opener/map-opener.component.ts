import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ActionSheetController, AlertController, ModalController } from '@ionic/angular';
import { ShowMapComponent } from '../show-map/show-map.component';
import { Capacitor, Plugins } from '@capacitor/core';
import { ActivatedRoute } from '@angular/router';
import { Order } from '../../order.model';
import { HttpClient } from '@angular/common/http';
import { OrderService } from '../../../order.service';
import { Subscription } from 'rxjs';
import { LocateService } from '../../locate.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-map-opener',
    templateUrl: './map-opener.component.html',
    styleUrls: ['./map-opener.component.scss'],
})
export class MapOpenerComponent implements OnInit, OnDestroy {
    @Input() order: Order;
    @Input() myPosition: { lat: number, lng: number };
    orderSub: Subscription;
    httpSub: Subscription;
    coordsSub: Subscription;
    center = { lat: 0, lng: 0 };

    constructor(
        private modalCtrl: ModalController,
        private actionSheetCtrl: ActionSheetController,
        private alertCtrl: AlertController,
        private activatedRoute: ActivatedRoute,
        private http: HttpClient,
        private orderService: OrderService,
        private locateService: LocateService,
        private translate: TranslateService
    ) {
    }

    ngOnInit() {
        this.orderSub = this.activatedRoute.paramMap.subscribe(p => {
            this.orderService.getAnOrder(p.get('id')).subscribe(order => {
                this.order = order;
            });
        });
        this.locateService.getLatLng(this.order.address).subscribe((response: { results: Array<any>, status: string }) => {
            this.center = response.results[0].geometry.location;
        });

    }

    onShowMap() {
        this.actionSheetCtrl.create({
            header: this.translate.instant('PLEASE CHOOSE'),
            buttons: [{
                text: this.translate.instant('ROUTE'),
                handler: () => {
                    this.openMap('route');
                }
            },
                {
                    text: this.translate.instant('ENDPOINT'),
                    handler: () => {
                        this.openMap('endPoint');
                    }
                }]
        }).then(actionEl => {
            actionEl.present();
        });
    }

    private openMap(mode: 'endPoint' | 'route') {
        this.modalCtrl.create({
            component: ShowMapComponent, componentProps: {
                center: { lat: this.center.lat, lng: this.center.lng },
                mode,
                myPosition: this.myPosition
            }
        }).then(modalEl => {
            modalEl.onDidDismiss().then(modalData => {
                if ( !modalData ) {
                    return;
                }
            });
            modalEl.present();
        });
    }

    private locateUser() {
        let coord: { lat: number, lng: number };
        if ( !Capacitor.isPluginAvailable('Geolocation') ) {
            this.showAlert('Could not fetch location', 'Please use the map to pick a location!');
            return;
        }
        Plugins.Geolocation.getCurrentPosition().then(geoPosition => {
            coord = { lat: geoPosition.coords.latitude, lng: geoPosition.coords.longitude };
            this.myPosition = coord;

        }).catch(err => {
            this.showAlert('Error to get location', 'Please turn on the location or use the map to pick a location!');
        });
        return coord;
    }

    showAlert(msg: string, header: string) {
        this.alertCtrl.create({
            header,
            message: msg,
            buttons: ['Okey']
        }).then(alertEl => alertEl.present());
    }

    ngOnDestroy() {
        if ( this.orderSub ) {
            this.orderSub.unsubscribe();
        }
        if ( this.coordsSub ) {
            this.coordsSub.unsubscribe();
        }
    }

}
