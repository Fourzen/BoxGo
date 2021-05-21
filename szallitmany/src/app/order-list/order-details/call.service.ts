import { Injectable } from '@angular/core';
import { CallNumber } from '@ionic-native/call-number/ngx';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class CallService {

  constructor(private callNumber: CallNumber,
              private toastCtrl: ToastController) {}

  callCustomer(number: string){
      this.callNumber.callNumber(number, true).catch(err => this.toastCtrl.create({
          message: err,
          duration: 50,
          position: 'bottom',
          animated: true
      }).then(toastEl => toastEl.present()));
  }

}
