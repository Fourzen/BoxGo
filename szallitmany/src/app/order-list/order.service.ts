import { Injectable } from '@angular/core';
import { Order } from './order-details/order.model';
import { BehaviorSubject } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { AuthService } from '../auth/auth.service';
import { map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class OrderService {

    orders: Order[] = [];
    private orderUpdate = new BehaviorSubject<Order[]>([]);

    constructor(private afs: AngularFirestore,
                private storage: AngularFireStorage,
                private authService: AuthService
    ) {
    }

    getOrders() {
        return this.orderUpdate.asObservable();
    }

    getMyOrders() {
        this.firestoreSnapshot().snapshotChanges().pipe(map(orders => {
            this.orders = [];

            return orders
                .filter(order => !!order.payload.doc.data())
                .filter(order => {
                    if ( order.payload.doc.data()['courierEmail'] === this.authService.email ) {
                        this.orders.push(order.payload.doc.data() as Order);
                    }
                });
        })).subscribe(() => {
            this.orderUpdate.next([...this.orders]);
        });
    }

    private firestoreSnapshot() {
        return this.afs.collection('orders');
    }

    getAnOrder(id: string) {
        return this.getDocById(id).pipe(map(order => {
            return order.data() as Order;
        }));
    }

    private getDocById(id: string) {
        return this.afs.doc(`orders/${id}`).get();
    }


    changeStatus(id: string, status: 'delivered' | 'rejected') {
        this.afs.collection('orders').doc(id).update({
            status
        });
    }

    rejectOrder(id: string, status: 'delivered' | 'rejected', note: string) {
        this.afs.collection('orders').doc(id).update({
            status,
            note
        });
    }

    acceptOrder(id: string) {
        this.afs.collection('orders').doc(id).update({
            courierEmail: this.authService.email
        });
    }

    sendSign(id: string, dataUrl) {
        this.storage.upload(`${id}`, this.makeBlob(dataUrl));
    }

    makeBlob(dataUrl) {
        const byteString = atob(dataUrl.split(',')[1]);
        const mimeString = dataUrl.split(',')[0].split(':')[1].split(';')[0];
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        for ( let i = 0; i < byteString.length; i++ ) {
            ia[i] = byteString.charCodeAt(i);
        }
        return new Blob([ab], { type: mimeString });
    }


}
