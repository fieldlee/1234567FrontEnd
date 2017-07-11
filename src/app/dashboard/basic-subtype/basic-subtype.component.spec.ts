import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BasicSubtypeComponent } from './basic-subtype.component';

describe('BasicSubtypeComponent', () => {
  let component: BasicSubtypeComponent;
  let fixture: ComponentFixture<BasicSubtypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BasicSubtypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BasicSubtypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
