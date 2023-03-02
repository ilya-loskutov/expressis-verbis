import { TestBed } from '@angular/core/testing';

import { SelectedDictionaryGuard } from './selected-dictionary.guard';

describe('SelectedDictionaryGuard', () => {
  let guard: SelectedDictionaryGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(SelectedDictionaryGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
