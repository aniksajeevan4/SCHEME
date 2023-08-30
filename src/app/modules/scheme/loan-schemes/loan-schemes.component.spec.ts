import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanSchemesComponent } from './loan-schemes.component';

describe('LoanSchemesComponent', () => {
  let component: LoanSchemesComponent;
  let fixture: ComponentFixture<LoanSchemesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoanSchemesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoanSchemesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
