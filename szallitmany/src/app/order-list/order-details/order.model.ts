import { Address } from './address.model';

export class Order {

    constructor(
        public id: string,
        public status: 'rejected' | 'onDeliver' | 'delivered',
        public type: 'box' | 'mail',
        public price: number,
        public address: Address,
        public payment: 'cash' | 'card',
        public customer: string,
        public paid: boolean,
        public orderDate: Date,
        public shippingDate: Date,
        public note: string,
        public courierEmail: string,
        public phone: string,
        public size?: {
            height: number,
            width: number,
            long: number,
            weight: number
        },
        public coords?: { lat: number, lng: number }
    ) {
    }
}

