import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResetpasswordconfirmComponent } from './resetpasswordconfirm.component';

describe('ResetpasswordconfirmComponent', () => {
  let component: ResetpasswordconfirmComponent;
  let fixture: ComponentFixture<ResetpasswordconfirmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResetpasswordconfirmComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResetpasswordconfirmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
