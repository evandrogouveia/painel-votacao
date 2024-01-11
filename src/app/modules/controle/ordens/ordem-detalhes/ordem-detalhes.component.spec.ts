import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdemDetalhesComponent } from './ordem-detalhes.component';

describe('OrdemDetalhesComponent', () => {
  let component: OrdemDetalhesComponent;
  let fixture: ComponentFixture<OrdemDetalhesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OrdemDetalhesComponent]
    });
    fixture = TestBed.createComponent(OrdemDetalhesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
