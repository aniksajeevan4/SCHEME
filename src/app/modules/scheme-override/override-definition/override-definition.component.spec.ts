import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OverrideDefinitionComponent } from './override-definition.component';

describe('OverrideDefinitionComponent', () => {
  let component: OverrideDefinitionComponent;
  let fixture: ComponentFixture<OverrideDefinitionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OverrideDefinitionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OverrideDefinitionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
