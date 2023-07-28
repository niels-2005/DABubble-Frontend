import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginnewuserwelcomemessageComponent } from './loginnewuserwelcomemessage.component';

describe('LoginnewuserwelcomemessageComponent', () => {
  let component: LoginnewuserwelcomemessageComponent;
  let fixture: ComponentFixture<LoginnewuserwelcomemessageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoginnewuserwelcomemessageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginnewuserwelcomemessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
