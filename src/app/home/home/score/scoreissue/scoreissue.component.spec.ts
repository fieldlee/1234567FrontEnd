import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScoreissueComponent } from './scoreissue.component';

describe('ScoreissueComponent', () => {
  let component: ScoreissueComponent;
  let fixture: ComponentFixture<ScoreissueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScoreissueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScoreissueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
