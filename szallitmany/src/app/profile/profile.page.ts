import { Component, OnDestroy, OnInit } from '@angular/core';
import { Courier } from './courier.modal';
import { ProfileService } from './profile.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit, OnDestroy {
  courier: Courier;
  courSub: Subscription;
  isLoading: boolean;
  constructor(private profileService: ProfileService) { }

  ngOnInit() {
    this.isLoading = true;
    this.courSub = this.profileService.getProfile().subscribe(courier => {
      this.courier = courier;

     });
    this.profileService.getCourier();

    this.isLoading = false;
  }

  ngOnDestroy(){
    if (this.courSub){
      this.courSub.unsubscribe();
    }
  }

}
