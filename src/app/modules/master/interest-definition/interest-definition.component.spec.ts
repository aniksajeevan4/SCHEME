import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InterestDefinitionComponent } from './interest-definition.component';

describe('InterestDefinitionComponent', () => {
  let component: InterestDefinitionComponent;
  let fixture: ComponentFixture<InterestDefinitionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InterestDefinitionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InterestDefinitionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
