import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameFrontComponent } from './game.front.component';

describe('GameFrontComponent', () => {
  let component: GameFrontComponent;
  let fixture: ComponentFixture<GameFrontComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GameFrontComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GameFrontComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
