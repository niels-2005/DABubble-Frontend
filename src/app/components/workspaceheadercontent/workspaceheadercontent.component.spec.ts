import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkspaceheadercontentComponent } from './workspaceheadercontent.component';

describe('WorkspaceheadercontentComponent', () => {
  let component: WorkspaceheadercontentComponent;
  let fixture: ComponentFixture<WorkspaceheadercontentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkspaceheadercontentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkspaceheadercontentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
