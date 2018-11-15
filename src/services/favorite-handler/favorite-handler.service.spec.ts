import { TestBed } from '@angular/core/testing';

import { FavoriteHandlerService } from './favorite-handler.service';

describe('FavoriteHandlerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FavoriteHandlerService = TestBed.get(FavoriteHandlerService);
    expect(service).toBeTruthy();
  });
});
