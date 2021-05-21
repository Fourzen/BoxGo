import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OrderDetailsPageRoutingModule } from './order-details-routing.module';

import { OrderDetailsPage } from './order-details.page';
import { SignPickerComponent } from './sign/sign-picker/sign-picker.component';
import { SignBoardComponent } from './sign/sign-board/sign-board.component';
import { MapOpenerComponent } from './map/map-opener/map-opener.component';
import { ShowMapComponent } from './map/show-map/show-map.component';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OrderDetailsPageRoutingModule,
    TranslateModule
  ],
    declarations: [OrderDetailsPage, SignPickerComponent, MapOpenerComponent, ShowMapComponent, SignBoardComponent]
})
export class OrderDetailsPageModule {}
