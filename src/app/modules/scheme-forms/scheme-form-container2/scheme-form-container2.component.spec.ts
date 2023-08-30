import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SchemeFormContainer2Component } from './scheme-form-container2.component';

describe('SchemeFormContainer2Component', () => {
  let component: SchemeFormContainer2Component;
  let fixture: ComponentFixture<SchemeFormContainer2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SchemeFormContainer2Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SchemeFormContainer2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
