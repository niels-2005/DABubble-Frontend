import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerifyuserquizComponent } from './verifyuserquiz.component';

describe('VerifyuserquizComponent', () => {
  let component: VerifyuserquizComponent;
  let fixture: ComponentFixture<VerifyuserquizComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VerifyuserquizComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerifyuserquizComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
