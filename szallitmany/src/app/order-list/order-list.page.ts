import { Component, OnDestroy, OnInit } from '@angular/core';
import { Order } from './order-details/order.model';
import { OrderService } from './order.service';
import { Subscription } from 'rxjs';
import { SegmentChangeEventDetail } from '@ionic/core';
import { HttpClient } from '@angular/common/http';
import { LocateService } from './order-details/locate.service';
import { SettingsService } from '../settings/settings.service';
import { Capacitor } from '@capacitor/core';

declare var google: any;

@Component({
    selector: 'app-order-list',
    templateUrl: './order-list.page.html',
    styleUrls: ['./order-list.page.scss'],
})
export class OrderListPage implements OnInit, OnDestroy {
    isLoading = false;
    locateSub: Subscription;
    coordsSub: Subscription;
    orderingSub: Subscription;
    myPos: { lat: number, lng: number };
    orders: Order[] = [];
    ordering: string;
    deliveredOrders: Order[] = [];
    displayedOrders: Order[] = [];
    rejectedOrders: Order[] = [];
    orderedOrders: Order[] = [];

    private orderSub: Subscription;
    filter = 'onDeliver';

    constructor(private orderService: OrderService,
                private http: HttpClient,
                private locateService: LocateService,
                private settingsService: SettingsService) {
    }

    ngOnInit() {

        this.coordsSub = this.locateService.getCoords().subscribe(coords => {
            this.myPos = coords;
        });
        this.locateService.locateUser();
        this.orderSub = this.orderService.getOrders().subscribe(data => {
                this.emptyArrays();
                for ( const order of data ) {
                    switch ( order.status ) {
                        case 'delivered':
                            this.deliveredOrders.push(order);
                            break;
                        case 'rejected':
                            this.rejectedOrders.push(order);
                            break;
                        case 'onDeliver':
                            this.orders.push(order);
                            break;
                    }

                }
                switch ( this.filter ) {
                    case 'completed':
                        this.displayedOrders = this.deliveredOrders;
                        break;
                    case 'onDeliver':
                        this.getMatrix(this.myPos, this.orders);

                        break;
                    case 'rejected':
                        this.displayedOrders = this.rejectedOrders;
                }
            }
        );
        this.orderService.getMyOrders();
        this.orderingSub = this.settingsService.getOrdering().subscribe(ordering => {
            this.ordering = ordering;
            this.getMatrix(this.myPos, this.orders);
        });
    }

    private emptyArrays() {
        this.deliveredOrders = [];
        this.displayedOrders = [];
        this.rejectedOrders = [];
        this.orders = [];
    }

    onFilterUpdate(event: CustomEvent<SegmentChangeEventDetail>) {

        this.filter = event.detail.value;
        switch ( this.filter ) {
            case 'completed':
                this.displayedOrders = this.deliveredOrders;
                break;
            case 'onDeliver':
                this.displayedOrders = this.orderedOrders;
                break;
            case 'rejected':
                this.displayedOrders = this.rejectedOrders;
                break;
        }
    }

    async orderingOrder(orders: Order[]) {
        for ( let i = 0; i < orders.length - 1; i++ ) {
            this.locateService.getLatLng(orders[i].address).subscribe((response: { results: Array<any>, status: string }) => {
                orders[i].coords = response.results[0].geometry.location;
            });
        }
    }

    ngOnDestroy() {
        if ( this.orderSub ) {
            this.orderSub.unsubscribe();
        }
        if ( this.coordsSub ) {
            this.coordsSub.unsubscribe();
        }
    }

    getMatrix(myPos: { lat: number, lng: number }, destinations: Order[]) {
        this.displayedOrders = null;
        if ( destinations.length < 2 || !Capacitor.isPluginAvailable('Geolocation') ) {
            this.orderedOrders = this.orders;
            this.displayedOrders = this.orders;
            return;
        }
        const origins = [];
        const dests: string[] = [];
        this.isLoading = true;
        origins.push(myPos);
        for ( const order of destinations ) {
            dests.push(this.makeAddressString(order));
        }
        if ( this.ordering === 'route' ) {
            for ( const element of dests ) {
                origins.push(element);
            }
        }
        const matrix = new google.maps.DistanceMatrixService();
        matrix.getDistanceMatrix({
            origins,
            destinations: dests,
            travelMode: google.maps.TravelMode.DRIVING,
            drivingOptions: {
                departureTime: new Date(Date.now()),
                trafficModel: 'optimistic'
            }
        }, (result) => {
            let distances: { distance: any, elemIndex: number, rowIndex?: number }[] = [];
            const tempArray: Order[] = [];
            if ( this.ordering === 'closest' ) {

                for ( let i = 0; i < dests.length; i++ ) {
                    distances.push({ distance: result.rows[0].elements[i].distance, elemIndex: i });
                }
                distances.sort((a, b) => {
                    return a.distance.value - b.distance.value;
                });

                for ( let i = 0; i < distances.length; i++ ) {
                    tempArray.push(this.orders[distances[i].elemIndex]);
                }

            } else if ( this.ordering === 'route' && dests.length > 2 ) {
                let counter = 0;
                for ( let i = 0; i < dests.length; i++ ) {
                    for ( let j = 0; j < dests.length; j++ ) {
                        distances.push({ distance: result.rows[counter].elements[j].distance, elemIndex: j, rowIndex: i });
                    }
                    distances.sort((a, b) => {
                        return a.distance.value - b.distance.value;
                    });
                    for ( const order of this.orders ) {
                        if ( (i === 0) && this.makeAddressString(order) === dests[distances[0].elemIndex] ) {
                            tempArray.push(order);
                            counter = distances[0].elemIndex;
                        } else if ( i === 1 && this.makeAddressString(order) === dests[distances[0].elemIndex] ) {
                            tempArray.push(order);
                            counter = distances[1].elemIndex;
                        } else if ( i > 1 && this.makeAddressString(order) === dests[distances[2].elemIndex] ) {
                            tempArray.push(order);
                            counter = distances[2].elemIndex;
                        }
                    }
                    distances = [];
                }
            }
            if ( tempArray ) {

                this.displayedOrders = [];
                this.displayedOrders = tempArray;
                this.orderedOrders = [];
                this.orderedOrders = tempArray;

            }

            this.isLoading = false;
        });

    }

    makeAddressString(order: Order) {
        return `${order.address.city} ${order.address.street} ${order.address.number}`;
    }
}
