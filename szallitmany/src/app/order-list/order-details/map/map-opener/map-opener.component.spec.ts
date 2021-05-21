import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MapOpenerComponent } from './map-opener.component';

describe('MapOpenerComponent', () => {
  let component: MapOpenerComponent;
  let fixture: ComponentFixture<MapOpenerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapOpenerComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MapOpenerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
