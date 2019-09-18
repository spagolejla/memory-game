import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JoinKeyPage } from './join-key.page';

describe('JoinKeyPage', () => {
  let component: JoinKeyPage;
  let fixture: ComponentFixture<JoinKeyPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JoinKeyPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JoinKeyPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
