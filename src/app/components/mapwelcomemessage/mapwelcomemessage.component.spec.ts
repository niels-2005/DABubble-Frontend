import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapwelcomemessageComponent } from './mapwelcomemessage.component';

describe('MapwelcomemessageComponent', () => {
  let component: MapwelcomemessageComponent;
  let fixture: ComponentFixture<MapwelcomemessageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MapwelcomemessageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MapwelcomemessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
