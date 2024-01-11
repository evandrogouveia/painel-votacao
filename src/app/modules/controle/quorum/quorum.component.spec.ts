import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuorumComponent } from './quorum.component';

describe('QuorumComponent', () => {
  let component: QuorumComponent;
  let fixture: ComponentFixture<QuorumComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [QuorumComponent]
    });
    fixture = TestBed.createComponent(QuorumComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
