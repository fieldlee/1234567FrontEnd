import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ForumActionComponent } from './forum-action.component';

describe('ForumActionComponent', () => {
  let component: ForumActionComponent;
  let fixture: ComponentFixture<ForumActionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ForumActionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ForumActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
