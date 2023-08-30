import { TestBed } from '@angular/core/testing';

import { InterestDefinitionService } from './interest-definition.service';

describe('InterestDefinitionService', () => {
  let service: InterestDefinitionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InterestDefinitionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
