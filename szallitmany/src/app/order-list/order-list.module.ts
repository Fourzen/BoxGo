import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OrderListPageRoutingModule } from './order-list-routing.module';

import { OrderListPage } from './order-list.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		IonicModule,
		OrderListPageRoutingModule,
		TranslateModule
	],
	declarations: [OrderListPage]
})
export class OrderListPageModule {
}
