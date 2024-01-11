import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GlobalTimerComponent } from './global-timer.component';

describe('GlobalTimerComponent', () => {
  let component: GlobalTimerComponent;
  let fixture: ComponentFixture<GlobalTimerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GlobalTimerComponent]
    });
    fixture = TestBed.createComponent(GlobalTimerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
