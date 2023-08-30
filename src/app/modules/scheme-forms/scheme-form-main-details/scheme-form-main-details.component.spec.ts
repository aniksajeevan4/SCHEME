import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SchemeFormMainDetailsComponent } from './scheme-form-main-details.component';

describe('SchemeFormMainDetailsComponent', () => {
  let component: SchemeFormMainDetailsComponent;
  let fixture: ComponentFixture<SchemeFormMainDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SchemeFormMainDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SchemeFormMainDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
