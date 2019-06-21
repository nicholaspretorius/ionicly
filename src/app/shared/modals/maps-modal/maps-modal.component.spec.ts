import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapsModalPage } from './maps-modal.page';

describe('MapsModalPage', () => {
  let component: MapsModalPage;
  let fixture: ComponentFixture<MapsModalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapsModalPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapsModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
