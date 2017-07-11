import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BasicDistrictComponent } from './basic-district.component';

describe('BasicDistrictComponent', () => {
  let component: BasicDistrictComponent;
  let fixture: ComponentFixture<BasicDistrictComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BasicDistrictComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BasicDistrictComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
