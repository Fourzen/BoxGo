import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ShowMapComponent } from './show-map.component';

describe('ShowMapComponent', () => {
  let component: ShowMapComponent;
  let fixture: ComponentFixture<ShowMapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowMapComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ShowMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
