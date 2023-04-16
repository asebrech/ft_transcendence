import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FindChannelComponent } from './find-channel.component';

describe('FindChannelComponent', () => {
  let component: FindChannelComponent;
  let fixture: ComponentFixture<FindChannelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FindChannelComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FindChannelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
