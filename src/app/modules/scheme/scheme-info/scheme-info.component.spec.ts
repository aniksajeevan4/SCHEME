import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SchemeInfoComponent } from './scheme-info.component';

describe('SchemeInfoComponent', () => {
  let component: SchemeInfoComponent;
  let fixture: ComponentFixture<SchemeInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SchemeInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SchemeInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
