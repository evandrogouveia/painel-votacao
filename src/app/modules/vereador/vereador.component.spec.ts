import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VereadorComponent } from './vereador.component';

describe('VereadorComponent', () => {
  let component: VereadorComponent;
  let fixture: ComponentFixture<VereadorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VereadorComponent]
    });
    fixture = TestBed.createComponent(VereadorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
