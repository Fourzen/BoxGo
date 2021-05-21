import { Component, Input, OnInit } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { SignBoardComponent } from '../sign-board/sign-board.component';
import { OrderService } from '../../../order.service';
import { Order } from '../../order.model';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-sign-picker',
    templateUrl: './sign-picker.component.html',
    styleUrls: ['./sign-picker.component.scss'],
})
export class SignPickerComponent implements OnInit {
    @Input() order: Order;
    savedSign: any;

    constructor(private modalCtrl: ModalController,
                private orderService: OrderService,
                private toastCtrl: ToastController,
                private translator: TranslateService
    ) {
    }

    ngOnInit() {
    }

    onSign() {
        if (this.order.status !== 'onDeliver'){
            this.toastCtrl.create({
                message: this.translator.instant(this.translator.instant(`THIS ORDER IS ALREADY ${this.order.status.toUpperCase()}`)),
                position: 'bottom',
                duration: 100
            }).then(toastEl => {
                toastEl.present();
            });
        }
        else {
            this.modalCtrl.create({
                component: SignBoardComponent,
                componentProps: { orderId: this.order.id }
            }).then(modalEl => {
                modalEl.onWillDismiss().then(modalData => {
                    if ( modalData.data.message === 'Successful sign' ) {
                        this.orderService.changeStatus(this.order.id, 'delivered');
                    }

                });
                modalEl.present();
            });
        }
    }
}
