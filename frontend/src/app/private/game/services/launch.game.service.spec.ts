import { TestBed } from '@angular/core/testing';

import { LaunchGameService } from './launch.game.service';

describe('LaunchGameService', () => {
  let service: LaunchGameService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LaunchGameService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
