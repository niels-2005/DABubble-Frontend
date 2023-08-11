import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SitenavigationComponent } from './sitenavigation.component';

describe('SitenavigationComponent', () => {
  let component: SitenavigationComponent;
  let fixture: ComponentFixture<SitenavigationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SitenavigationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SitenavigationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
