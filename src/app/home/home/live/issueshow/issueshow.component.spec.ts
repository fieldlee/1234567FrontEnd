import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IssueshowComponent } from './issueshow.component';

describe('IssueshowComponent', () => {
  let component: IssueshowComponent;
  let fixture: ComponentFixture<IssueshowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IssueshowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IssueshowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
