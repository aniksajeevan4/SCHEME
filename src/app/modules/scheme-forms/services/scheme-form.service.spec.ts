import { TestBed } from '@angular/core/testing';

import { SchemeFormService } from './scheme-form.service';

describe('SchemeFormService', () => {
  let service: SchemeFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SchemeFormService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
