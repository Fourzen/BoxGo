import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { SettingsService } from './settings.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {

  language = [];
  selected = '';
  dark: boolean;
  ordering = 'closest';
  orderingSub: Subscription;

  constructor(
      private modalCtrl: ModalController,
      private settingsService: SettingsService
  ) {
  }

  ngOnInit() {
    this.language = this.settingsService.getLanguages();
    this.selected = this.settingsService.selected;
    this.orderingSub = this.settingsService.getOrdering().subscribe(ordering => {
      this.ordering = ordering;
    });

  }

  toggleDarkMode() {
    this.settingsService.toggleDarkMode();
  }
  onChangeLng(event){
    this.settingsService.setLanguage(event.detail.value);
  }
  onSetOrdering(event){
    this.settingsService.setOrdering(event.detail.value);
  }
}
