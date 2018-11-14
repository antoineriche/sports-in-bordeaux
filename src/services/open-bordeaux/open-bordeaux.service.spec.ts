import { TestBed } from '@angular/core/testing';

import { OpenBordeauxService } from './open-bordeaux.service';

describe('OpenBordeauxService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: OpenBordeauxService = TestBed.get(OpenBordeauxService);
    expect(service).toBeTruthy();
  });
});
