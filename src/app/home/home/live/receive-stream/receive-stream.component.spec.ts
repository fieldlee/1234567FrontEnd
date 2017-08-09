import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceiveStreamComponent } from './receive-stream.component';

describe('ReceiveStreamComponent', () => {
  let component: ReceiveStreamComponent;
  let fixture: ComponentFixture<ReceiveStreamComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReceiveStreamComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReceiveStreamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
