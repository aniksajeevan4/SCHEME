import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SchemeFormSubDetailsComponent } from './scheme-form-sub-details.component';

describe('SchemeFormSubDetailsComponent', () => {
  let component: SchemeFormSubDetailsComponent;
  let fixture: ComponentFixture<SchemeFormSubDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SchemeFormSubDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SchemeFormSubDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
