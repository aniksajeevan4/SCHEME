import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContainerOfficeAccountComponent } from './container-office-account.component';

describe('ContainerOfficeAccountComponent', () => {
  let component: ContainerOfficeAccountComponent;
  let fixture: ComponentFixture<ContainerOfficeAccountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContainerOfficeAccountComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContainerOfficeAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
