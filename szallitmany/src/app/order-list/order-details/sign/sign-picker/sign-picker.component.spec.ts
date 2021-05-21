import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SignPickerComponent } from './sign-picker.component';

describe('SignPickerComponent', () => {
  let component: SignPickerComponent;
  let fixture: ComponentFixture<SignPickerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SignPickerComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SignPickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
