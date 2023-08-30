import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SchemeFormDetailsComponent } from './scheme-form-details.component';

describe('SchemeFormDetailsComponent', () => {
  let component: SchemeFormDetailsComponent;
  let fixture: ComponentFixture<SchemeFormDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SchemeFormDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SchemeFormDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
