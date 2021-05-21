import { Component, Input, OnInit } from '@angular/core';
import { AlertController, NavController, PopoverController } from '@ionic/angular';
import { OrderService } from '../../order.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-order-popover',
  templateUrl: './order-popover.component.html',
  styleUrls: ['./order-popover.component.scss'],
})
export class OrderPopoverComponent implements OnInit {

	@Input() id: string;
	@Input() note: string;
	button = this.translate.instant('REJECT');
  constructor( private popoverCtrl: PopoverController,
               private orderService: OrderService,
               private alertCtrl: AlertController,
               private translate: TranslateService,
               private navCtrl: NavController) { }

  ngOnInit() {}


	onDeclineOrder() {
		this.alertCtrl.create({
			header: this.translate.instant('REJECT ORDER'),
			message: this.translate.instant('DO YOU WANT TO REJECT THIS ORDER') + '?',
			buttons: [
				{
					text: this.translate.instant('NOONE CAME OUT'),
					handler: () =>{
						this.note += ' - Noone came out'
						this.orderService.rejectOrder(this.id, 'rejected', this.note);
						this.navCtrl.navigateBack('/order-list');
						this.popoverCtrl.dismiss();
					}
				},
				{
					text: this.translate.instant('REJECTED'),
					handler: () => {
						this.note += ' - Didn\'t accept the package';
						this.orderService.rejectOrder(this.id, 'rejected', this.note);
						this.popoverCtrl.dismiss();
						this.navCtrl.navigateBack('/order-list');
					}
				},
				{
					text: this.translate.instant('CANCEL'),
					handler: () => {
						this.popoverCtrl.dismiss();
					}
				}
			],
			animated: true
		}).then(alertEl => alertEl.present());
	}
}
