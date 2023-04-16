import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckPassComponent } from './check-pass.component';

describe('CheckPassComponent', () => {
  let component: CheckPassComponent;
  let fixture: ComponentFixture<CheckPassComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CheckPassComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CheckPassComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
