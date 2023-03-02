import { TestBed } from '@angular/core/testing';

import { EntryResolver } from './entry.resolver';

describe('EntryResolver', () => {
  let resolver: EntryResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(EntryResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
