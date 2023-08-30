import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SchemeBranchLimitComponent } from './scheme-branch-limit.component';

describe('SchemeBranchLimitComponent', () => {
  let component: SchemeBranchLimitComponent;
  let fixture: ComponentFixture<SchemeBranchLimitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SchemeBranchLimitComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SchemeBranchLimitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
