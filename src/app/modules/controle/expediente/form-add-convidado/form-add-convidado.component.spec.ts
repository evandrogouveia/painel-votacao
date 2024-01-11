import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormAddConvidadoComponent } from './form-add-convidado.component';

describe('FormAddConvidadoComponent', () => {
  let component: FormAddConvidadoComponent;
  let fixture: ComponentFixture<FormAddConvidadoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FormAddConvidadoComponent]
    });
    fixture = TestBed.createComponent(FormAddConvidadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
