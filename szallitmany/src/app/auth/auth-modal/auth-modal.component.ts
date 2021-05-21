import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { ModalController } from '@ionic/angular';

@Component({
    selector: 'app-auth-modal',
    templateUrl: './auth-modal.component.html',
    styleUrls: ['./auth-modal.component.scss'],
})
export class AuthModalComponent implements OnInit {
    form: FormGroup;

    constructor(private authService: AuthService,
                private modalCtrl: ModalController) {
    }

    ngOnInit() {
        this.form = new FormGroup({
            email: new FormControl(null, {
                updateOn: 'blur',
                validators: [Validators.required, Validators.email]
            })
        });
    }

    onSendPasswordResetEmail() {
        this.authService.sendPasswordResetEmail(this.form.value.email);
    }

    onDismissModal() {
        this.modalCtrl.dismiss();
    }
}
