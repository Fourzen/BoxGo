import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import jsQR from 'jsqr';
import { LoadingController, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'qr-scanner',
  templateUrl: './qr-scanner.page.html',
  styleUrls: ['./qr-scanner.page.scss'],
})
export class QrScannerPage implements OnInit, AfterViewInit {
  scanActive = false;
  scanResult = null;
  @ViewChild('video', { static: false }) video: ElementRef;
  @ViewChild('canvas', { static: false }) canvas: ElementRef;

  videoElement: any;
  canvasElement: any;
  loading: HTMLIonLoadingElement;
  canvasContext: any;

  constructor(private toastCtrl: ToastController,
              private loadingCtrl: LoadingController,
              private router: Router) {
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.videoElement = this.video.nativeElement;
    this.canvasElement = this.canvas.nativeElement;
    this.canvasContext = this.canvasElement.getContext('2d');
  }

  async startScan() {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'environment' }
    });
    this.videoElement.srcObject = stream;
    this.videoElement.setAttribute('playsinline', true);
    this.videoElement.play();

    this.loading = await this.loadingCtrl.create({});
    this.loading.present();
    requestAnimationFrame(this.scan.bind(this));
  }

  async scan() {
    if ( this.videoElement.readyState === this.videoElement.HAVE_ENOUGH_DATA ) {
      if ( this.loading ) {
        await this.loading.dismiss();
        this.loading = null;
        this.scanActive = true;
      }
      this.canvasContext.drawImage(
          this.videoElement,
          0,
          0,
          this.canvasElement.width,
          this.canvasElement.height,
      );
      const imageData = this.canvasContext.getImageData(0, 0, this.canvasElement.width, this.canvasElement.height);

      const code = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: 'dontInvert'
      });
      if ( code ) {
        this.scanActive = false;
        this.scanResult = code.data;
        this.router.navigateByUrl(`/order-list/order-details/${code.data}`);
      } else {
        if (this.scanActive) {
          requestAnimationFrame(this.scan.bind(this));
        }
      }
    } else {
      requestAnimationFrame(this.scan.bind(this));
    }
  }

  stopScan() {
    this.scanActive = false;
  }

  async showQrToast() {
    this.toastCtrl.create({
      message: `Open ${this.scanResult}`,
      position: 'bottom',
    }).then(toastEl => toastEl.present());
  }
}

