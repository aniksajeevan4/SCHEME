import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CisSearchCustomerComponent } from './cis-search-customer.component';

describe('CisSearchCustomerComponent', () => {
  let component: CisSearchCustomerComponent;
  let fixture: ComponentFixture<CisSearchCustomerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CisSearchCustomerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CisSearchCustomerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
