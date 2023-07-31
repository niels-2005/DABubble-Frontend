import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditprofilesitebarComponent } from './editprofilesitebar.component';

describe('EditprofilesitebarComponent', () => {
  let component: EditprofilesitebarComponent;
  let fixture: ComponentFixture<EditprofilesitebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditprofilesitebarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditprofilesitebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
