import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChannelOptionComponent } from './channel-option.component';

describe('ChannelOptionComponent', () => {
  let component: ChannelOptionComponent;
  let fixture: ComponentFixture<ChannelOptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChannelOptionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChannelOptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
