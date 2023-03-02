import { TestBed } from '@angular/core/testing';

import { CanDeactivateEntryGuard } from './can-deactivate-entry.guard';

describe('CanDeactivateEntryGuard', () => {
  let guard: CanDeactivateEntryGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(CanDeactivateEntryGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
