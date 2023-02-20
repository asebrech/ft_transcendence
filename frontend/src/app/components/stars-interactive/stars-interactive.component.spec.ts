import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StarsInteractiveComponent } from './stars-interactive.component';

describe('StarsInteractiveComponent', () => {
  let component: StarsInteractiveComponent;
  let fixture: ComponentFixture<StarsInteractiveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StarsInteractiveComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StarsInteractiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
