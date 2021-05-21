import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { AlertController, ModalController, Platform, ToastController } from '@ionic/angular';
import { Base64ToGallery } from '@ionic-native/base64-to-gallery/ngx';
import { OrderService } from '../../../order.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';


@Component({
    selector: 'app-sign',
    templateUrl: './sign-board.component.html',
    styleUrls: ['./sign-board.component.scss'],
})
export class SignBoardComponent implements OnInit, AfterViewInit {
    @ViewChild('imageCanvas', { static: false }) canvas: any;
    @Input() orderId: string;
    canvasElement: any;
    saveX: number;
    saveY: number;
    platform: boolean;
    drawing = false;
    color = '#3880ff';
    lineWith = 3;
    blob: SafeUrl;

    constructor(
        private plt: Platform,
        private base64ToGallery: Base64ToGallery,
        private toastCtrl: ToastController,
        private orderService: OrderService,
        private modalCtrl: ModalController
    ) {
    }

    ngOnInit() {
    }

    ngAfterViewInit() {
        this.canvasElement = this.canvas.nativeElement;
        this.canvasElement.width = this.plt.width() + '';
        this.canvasElement.height = (this.plt.height() * 0.6) + '';
    }

    onStartSign(ev) {
        this.drawing = true;
        const canvasPosition = this.canvasElement.getBoundingClientRect();
        if ( ev.type === 'mousedown' ) {
            this.saveX = ev.pageX - canvasPosition.x;
            this.saveY = ev.pageY - canvasPosition.y;

        } else {
            this.saveX = ev.changedTouches[0].pageX - canvasPosition.x;
            this.saveY = ev.changedTouches[0].pageY - canvasPosition.y;
        }


    }

    onMovedSign(ev) {
        if ( !this.drawing ) {
            return;
        }
        let currentX: number;
        let currentY: number;
        const canvasPosition = this.canvasElement.getBoundingClientRect();
        const ctx = this.canvasElement.getContext('2d');
        if ( ev.type === 'mousemove' ) {
            currentX = ev.pageX - canvasPosition.x;
            currentY = ev.pageY - canvasPosition.y;
        } else {
            currentX = ev.changedTouches[0].pageX - canvasPosition.x;
            currentY = ev.changedTouches[0].pageY - canvasPosition.y;
        }
        ctx.lineJoin = 'round';
        ctx.strokeStyle = this.color;
        ctx.lineWidth = this.lineWith;

        ctx.beginPath();
        ctx.moveTo(this.saveX, this.saveY);
        ctx.lineTo(currentX, currentY);
        ctx.closePath();

        ctx.stroke();

        this.saveX = currentX;
        this.saveY = currentY;
    }


    onFinishSign() {
        this.drawing = false;

    }

    saveImage() {
        const dataUrl = this.canvasElement.toDataURL();
        this.orderService.sendSign(this.orderId, dataUrl);
        this.modalCtrl.dismiss({
            message: 'Successful sign'
        });

    }


    basetoBlob(b64Data, contentType) {
        contentType = contentType || '';
        const sliceSize = 1024;
        const byteCharacters = atob(b64Data);
        const bytesLength = byteCharacters.length;
        const slicesCount = Math.ceil(bytesLength / sliceSize);
        const byteArrays = new Array(slicesCount);

        for ( let sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex ) {
            const begin = sliceIndex * sliceSize;
            const end = Math.min(begin + sliceSize, bytesLength);
            const bytes = new Array(end - begin);
            for ( let offset = begin, i = 0; offset < end; ++i, ++offset ) {
                bytes[i] = byteCharacters[offset].charCodeAt(0);
            }
            byteArrays[sliceIndex] = new Uint8Array(bytes);
        }
        return new Blob(byteArrays, { type: contentType });
    }

    onDismiss() {
        this.modalCtrl.dismiss({
            message: 'Dismissed'
        });
    }
}
