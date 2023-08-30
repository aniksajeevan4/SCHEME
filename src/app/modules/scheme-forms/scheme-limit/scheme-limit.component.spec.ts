import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SchemeLimitComponent } from './scheme-limit.component';

describe('SchemeLimitComponent', () => {
  let component: SchemeLimitComponent;
  let fixture: ComponentFixture<SchemeLimitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SchemeLimitComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SchemeLimitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
