import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberOptionComponent } from './member-option.component';

describe('MemberOptionComponent', () => {
  let component: MemberOptionComponent;
  let fixture: ComponentFixture<MemberOptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MemberOptionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MemberOptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
