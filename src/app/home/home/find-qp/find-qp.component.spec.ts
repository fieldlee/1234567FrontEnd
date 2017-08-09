import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FindQpComponent } from './find-qp.component';

describe('FindQpComponent', () => {
  let component: FindQpComponent;
  let fixture: ComponentFixture<FindQpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FindQpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FindQpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
