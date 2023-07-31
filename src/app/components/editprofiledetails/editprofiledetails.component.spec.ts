import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditprofiledetailsComponent } from './editprofiledetails.component';

describe('EditprofiledetailsComponent', () => {
  let component: EditprofiledetailsComponent;
  let fixture: ComponentFixture<EditprofiledetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditprofiledetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditprofiledetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
