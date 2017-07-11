import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BasicConfigComponent } from './basic-config.component';

describe('BasicConfigComponent', () => {
  let component: BasicConfigComponent;
  let fixture: ComponentFixture<BasicConfigComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BasicConfigComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BasicConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
