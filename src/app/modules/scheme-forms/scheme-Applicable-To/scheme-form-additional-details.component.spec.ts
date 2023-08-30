import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SchemeFormAdditionalDetailsComponent } from './scheme-form-additional-details.component';


describe('SchemeFormAdditionalDetailsComponent', () => {
  let component: SchemeFormAdditionalDetailsComponent;
  let fixture: ComponentFixture<SchemeFormAdditionalDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SchemeFormAdditionalDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SchemeFormAdditionalDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
