import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplateProgressSpinnerComponent } from './template-progress-spinner.component';

describe('TemplateProgressSpinnerComponent', () => {
  let component: TemplateProgressSpinnerComponent;
  let fixture: ComponentFixture<TemplateProgressSpinnerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TemplateProgressSpinnerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TemplateProgressSpinnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
