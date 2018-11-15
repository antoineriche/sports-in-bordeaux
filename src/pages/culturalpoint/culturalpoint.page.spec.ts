import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CulturalpointPage } from './culturalpoint.page';

describe('CulturalpointPage', () => {
  let component: CulturalpointPage;
  let fixture: ComponentFixture<CulturalpointPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CulturalpointPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CulturalpointPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
