import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BasicProviceComponent } from './basic-provice.component';

describe('BasicProviceComponent', () => {
  let component: BasicProviceComponent;
  let fixture: ComponentFixture<BasicProviceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BasicProviceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BasicProviceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
