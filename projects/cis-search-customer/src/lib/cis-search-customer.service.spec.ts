import { TestBed } from '@angular/core/testing';

import { CisSearchCustomerService } from './cis-search-customer.service';

describe('CisSearchCustomerService', () => {
  let service: CisSearchCustomerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CisSearchCustomerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
