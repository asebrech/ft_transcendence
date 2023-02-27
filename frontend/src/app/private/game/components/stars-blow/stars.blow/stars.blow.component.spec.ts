import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StarsBlowComponent } from './stars.blow.component';

describe('StarsBlowComponent', () => {
  let component: StarsBlowComponent;
  let fixture: ComponentFixture<StarsBlowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StarsBlowComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StarsBlowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
