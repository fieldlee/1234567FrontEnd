import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScoreplayComponent } from './scoreplay.component';

describe('ScoreplayComponent', () => {
  let component: ScoreplayComponent;
  let fixture: ComponentFixture<ScoreplayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScoreplayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScoreplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
