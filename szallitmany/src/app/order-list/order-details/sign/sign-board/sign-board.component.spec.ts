import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SignBoardComponent } from './sign-board.component';

describe('SignComponent', () => {
  let component: SignBoardComponent;
  let fixture: ComponentFixture<SignBoardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SignBoardComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SignBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
