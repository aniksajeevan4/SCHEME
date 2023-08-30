import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SchemeFormDocDetailsComponent } from './scheme-form-doc-details.component';

describe('SchemeFormDocDetailsComponent', () => {
  let component: SchemeFormDocDetailsComponent;
  let fixture: ComponentFixture<SchemeFormDocDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SchemeFormDocDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SchemeFormDocDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
