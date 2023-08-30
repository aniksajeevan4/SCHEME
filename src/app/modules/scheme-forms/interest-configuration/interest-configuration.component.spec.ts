import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InterestConfigurationComponent } from './interest-configuration.component';

describe('InterestConfigurationComponent', () => {
  let component: InterestConfigurationComponent;
  let fixture: ComponentFixture<InterestConfigurationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InterestConfigurationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InterestConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
