import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BasicCityComponent } from './basic-city.component';

describe('BasicCityComponent', () => {
  let component: BasicCityComponent;
  let fixture: ComponentFixture<BasicCityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BasicCityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BasicCityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
