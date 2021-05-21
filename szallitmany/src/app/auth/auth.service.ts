import { EventEmitter, Injectable } from "@angular/core";
import { AngularFireAuth} from '@angular/fire/auth';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
    providedIn:"root"
})
export class AuthService{
    loggedIn = false;
    private _email = '';
    process = new EventEmitter<boolean>();

    constructor(private auth: AngularFireAuth,
                private router: Router,
                private toastCtrl: ToastController,
                private translate: TranslateService) {
    }

    login(email: string, password: string){
        this.process.emit(true);
        this.auth.signInWithEmailAndPassword(email, password).then(res => {
            this._email = res.user.email;
            this.loggedIn = true;
            this.process.emit(false);
            this.router.navigateByUrl('/profile');
        }).catch(err => {
            this.process.emit(null);

        });
    }
    logoff(){
        this.loggedIn = false;
        this._email = '';
        this.auth.signOut().then(r =>{
            this.makeToast(this.translate.instant('SUCCESSFULL LOGOUT'));
            }
        ).catch(error => {
            this.makeToast(this.translate.instant('SOMETHING WENT WRONG'));
        });
    }
    get email() {
        return this._email;
    }
    makeToast(message: string){
        this.toastCtrl.create({
            message,
            animated: true,
            duration: 1500,
            position: 'bottom'
        }).then(toastEl => toastEl.present());
    }
    sendPasswordResetEmail(email: string){

        this.auth.sendPasswordResetEmail(email).then(r => {
            this.makeToast(this.translate.instant('EMAIL HAS BEEN SENT, MAKE SURE YOU CHECK SPAM'));
        }).catch(error => {
            if (error.code === 'auth/invalid-email')
            {
                this.makeToast(this.translate.instant('INVALID EMAIL'));
            }
            else {
                this.makeToast(this.translate.instant('SOMETHING WENT WRONG'));
            }
        });
    }
}
