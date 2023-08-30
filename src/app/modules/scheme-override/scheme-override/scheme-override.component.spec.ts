import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SchemeOverrideComponent } from './scheme-override.component';

describe('SchemeOverrideComponent', () => {
  let component: SchemeOverrideComponent;
  let fixture: ComponentFixture<SchemeOverrideComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SchemeOverrideComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SchemeOverrideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
