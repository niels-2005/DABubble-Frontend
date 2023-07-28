import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserlockedmessageComponent } from './userlockedmessage.component';

describe('UserlockedmessageComponent', () => {
  let component: UserlockedmessageComponent;
  let fixture: ComponentFixture<UserlockedmessageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserlockedmessageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserlockedmessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
