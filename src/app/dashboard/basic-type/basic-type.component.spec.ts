import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BasicTypeComponent } from './basic-type.component';

describe('BasicTypeComponent', () => {
  let component: BasicTypeComponent;
  let fixture: ComponentFixture<BasicTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BasicTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BasicTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
