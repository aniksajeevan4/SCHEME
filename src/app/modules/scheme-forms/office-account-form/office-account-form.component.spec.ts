import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OfficeAccountFormComponent } from './office-account-form.component';

describe('OfficeAccountFormComponent', () => {
  let component: OfficeAccountFormComponent;
  let fixture: ComponentFixture<OfficeAccountFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OfficeAccountFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OfficeAccountFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
