import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkspacecontentleftComponent } from './workspacecontentleft.component';

describe('WorkspacecontentleftComponent', () => {
  let component: WorkspacecontentleftComponent;
  let fixture: ComponentFixture<WorkspacecontentleftComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkspacecontentleftComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkspacecontentleftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
