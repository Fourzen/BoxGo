import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { filter, map } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
import { Courier } from './courier.modal';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ProfileService {
    private courier: Courier = null;
    private courSub = new BehaviorSubject<Courier>(this.courier);

    constructor(private afs: AngularFirestore,
                private authService: AuthService) {
    }


    getCourier() {
        return this.afs.collection(`couriers`).snapshotChanges().pipe(map(couriers => {
            return couriers.filter(courier => !!courier
            )
                .filter(courier => {
                    if ( courier.payload.doc.data()['email'] === this.authService.email ) {
                        this.courier = courier.payload.doc.data() as Courier;
                    }
                });

        })).subscribe(() => {
            this.courSub.next(this.courier);
        });
    }

    getProfile() {
        return this.courSub.asObservable();
    }

}
