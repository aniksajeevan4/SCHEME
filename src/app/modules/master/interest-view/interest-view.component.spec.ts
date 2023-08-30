import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InterestViewComponent } from './interest-view.component';

describe('InterestViewComponent', () => {
  let component: InterestViewComponent;
  let fixture: ComponentFixture<InterestViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InterestViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InterestViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
