import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KeyListPage } from './key-list.page';

describe('KeyListPage', () => {
  let component: KeyListPage;
  let fixture: ComponentFixture<KeyListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KeyListPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KeyListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
