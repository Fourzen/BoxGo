import { Inject, Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { Storage } from '@ionic/storage';
import { BehaviorSubject } from 'rxjs';


const LNG_KEY = 'SELECTED_LANGUAGE'
@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  dark = false;
  prefersColor = window.matchMedia('(prefers-color-schema: dark)');
  renderer: Renderer2;
  ordering: 'route' | 'closest' = 'closest';
  orderSubj = new BehaviorSubject<string>(this.ordering);
  selected = '';

  constructor(private rendererFactory: RendererFactory2,
              @Inject(DOCUMENT) private document: Document,
              private translate: TranslateService,
              private storage: Storage) {
    this.renderer = this.rendererFactory.createRenderer(null,null);
  }


  toggleDarkMode(){
    this.dark = !this.dark;
    document.body.classList.toggle( 'dark' );
  }

  setInitialAppLanguage(){
    const language = this.translate.getBrowserLang();
    this.translate.setDefaultLang(language);

    this.storage.get(LNG_KEY).then(val => {
      if (val) {
        this.setLanguage(val);
        this.selected = val;
      }
    });
  }
  getLanguages(){
    return [
      { text: 'English', value: 'en'},
      { text: 'Hungarian', value: 'hu'},
    ];
  }

  setLanguage(lng){
    this.translate.use(lng);
    this.selected = lng;
    this.storage.set(LNG_KEY, lng);
  }
  textColors() {
    if (this.dark){
      return 'white';
    }
    return 'black';
  }
  setOrdering(ordering: 'route' | 'closest'){
    this.ordering = ordering;
    this.orderSubj.next(this.ordering);
  }
  getOrdering(){
    return this.orderSubj.asObservable();
  }
}
