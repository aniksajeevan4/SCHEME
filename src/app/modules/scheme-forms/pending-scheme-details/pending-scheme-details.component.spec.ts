import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PendingSchemeDetailsComponent } from './pending-scheme-details.component';

describe('PendingSchemeDetailsComponent', () => {
  let component: PendingSchemeDetailsComponent;
  let fixture: ComponentFixture<PendingSchemeDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PendingSchemeDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PendingSchemeDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
