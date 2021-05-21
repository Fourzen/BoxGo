import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from './auth.service';
import { ModalController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { AuthModalComponent } from './auth-modal/auth-modal.component';

@Component({
    selector: 'app-auth',
    templateUrl: './auth.page.html',
    styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {
    form: FormGroup;
    isError = false;
    isLoading = false;

    constructor(private authService: AuthService,
                private modalCtrl: ModalController) {
    }

    ngOnInit() {
        this.form = new FormGroup({
            email: new FormControl(null, {
                validators: [Validators.required, Validators.email]
            }),
            password: new FormControl(null, {
                validators: [Validators.required]
            })
        });
        this.authService.process.subscribe(bool => {
            if ( bool === null ) {
                this.isLoading = false;
                this.isError = true;
            } else {
                this.isLoading = bool;
            }
        });
    }

    onSubmit() {
        this.isError = false;
        this.authService.login(this.form.value.email, this.form.value.password);
        this.form.reset();
    }

    onOpenAlert() {
        this.modalCtrl.create({
            animated: true,
            component: AuthModalComponent,
        }).then(modalEl => modalEl.present());
    }
}

