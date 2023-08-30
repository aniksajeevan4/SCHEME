import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SchemeFormContainerComponent } from './scheme-form-container.component';

describe('SchemeFormContainerComponent', () => {
  let component: SchemeFormContainerComponent;
  let fixture: ComponentFixture<SchemeFormContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SchemeFormContainerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SchemeFormContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
