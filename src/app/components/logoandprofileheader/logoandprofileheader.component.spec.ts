import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogoandprofileheaderComponent } from './logoandprofileheader.component';

describe('LogoandprofileheaderComponent', () => {
  let component: LogoandprofileheaderComponent;
  let fixture: ComponentFixture<LogoandprofileheaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LogoandprofileheaderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LogoandprofileheaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
