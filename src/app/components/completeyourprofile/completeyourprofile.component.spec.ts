import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompleteyourprofileComponent } from './completeyourprofile.component';

describe('CompleteyourprofileComponent', () => {
  let component: CompleteyourprofileComponent;
  let fixture: ComponentFixture<CompleteyourprofileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompleteyourprofileComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompleteyourprofileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
