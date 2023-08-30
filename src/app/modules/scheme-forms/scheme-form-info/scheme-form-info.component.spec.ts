import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SchemeFormInfoComponent } from './scheme-form-info.component';

describe('SchemeFormInfoComponent', () => {
  let component: SchemeFormInfoComponent;
  let fixture: ComponentFixture<SchemeFormInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SchemeFormInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SchemeFormInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
