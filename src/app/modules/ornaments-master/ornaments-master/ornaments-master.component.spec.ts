import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrnamentsMasterComponent } from './ornaments-master.component';

describe('OrnamentsMasterComponent', () => {
  let component: OrnamentsMasterComponent;
  let fixture: ComponentFixture<OrnamentsMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrnamentsMasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrnamentsMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
