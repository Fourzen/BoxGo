import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Order } from './order.model';
import { OrderService } from '../order.service';
import { Subscription } from 'rxjs';
import { AlertController, NavController, PopoverController } from '@ionic/angular';
import { CallService } from './call.service';
import { SettingsService } from '../../settings/settings.service';
import { OrderPopoverComponent } from './order-popover/order-popover.component';
import { LocateService } from './locate.service';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../auth/auth.service';

@Component({
    selector: 'app-order-details',
    templateUrl: './order-details.page.html',
    styleUrls: ['./order-details.page.scss'],
})
export class OrderDetailsPage implements OnInit, OnDestroy {
    order: Order;
    myPosition: { lat: number, lng: number };
    isLoading = true;
    paramSub: Subscription;
    fireSub: Subscription;
    coordSub: Subscription;

    constructor(private activatedRoute: ActivatedRoute,
                private orderService: OrderService,
                private navCtrl: NavController,
                private callService: CallService,
                private settingsService: SettingsService,
                private popoverCtrl: PopoverController,
                private locateService: LocateService,
                private alertCtrl: AlertController,
                private translate: TranslateService,
                private authService: AuthService
    ) {
    }

    ngOnInit() {
        this.paramSub = this.activatedRoute.paramMap.subscribe(p => {
            if ( !p.has('id') ) {
                this.navCtrl.navigateBack('/order-list');
                return;
            }

            this.fireSub = this.orderService.getAnOrder(p.get('id')).subscribe(order => {
                if ( order.courierEmail === this.authService.email ) {
                    this.order = order;
                } else if ( order.courierEmail !== this.authService.email ) {
                    if ( order.courierEmail === '' || order.courierEmail === null ) {
                        this.alertCtrl.create({
                            header: this.translate.instant('THIS ORDER BELONGS TO NOBODY'),
                            message: this.translate.instant('DO YOU WANT TO COMPLETE THIS ORDER') + '?',
                            buttons: [{
                                text: this.translate.instant('YES'),
                                handler: () => {
                                    this.orderService.acceptOrder(order.id);
                                    this.order = order;
                                }

                            },
                                {
                                    text: this.translate.instant('No'),
                                    role: 'cancel'
                                }]
                        }).then(alertEl => alertEl.present());
                    } else {
                        this.alertCtrl.create({
                            header: this.translate.instant('ERROR'),
                            message: this.translate.instant('THIS ORDER BELONGS TO SOMEONE ELSE'),
                            buttons: [{
                                text: 'OK',
                                handler: () => {
                                    this.navCtrl.navigateBack('/qr-scanner');
                                }
                            }]
                        }).then(alertEl => alertEl.present());
                    }
                }
                this.isLoading = false;
            });
        });
        this.coordSub = this.locateService.getCoords().subscribe(coords => {
            this.myPosition = coords;
        });
        this.locateService.locateUser();

    }

    callCustomer() {
        this.callService.callCustomer(this.order.phone);
    }

    textColors() {
        const color = this.settingsService.textColors();
        return `color: ${color}`;
    }

    openPopover($event) {
        this.popoverCtrl.create({
            component: OrderPopoverComponent,
            event: $event,
            animated: true,
            componentProps: { id: this.order.id, note: this.order.note }
        }).then(popEl => popEl.present());
    }

    ngOnDestroy() {
        if ( this.paramSub ) {
            this.paramSub.unsubscribe();
        }
        if ( this.fireSub ) {
            this.fireSub.unsubscribe();
        }
    }
}
