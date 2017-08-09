import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassauthComponent } from './classauth.component';

describe('ClassauthComponent', () => {
  let component: ClassauthComponent;
  let fixture: ComponentFixture<ClassauthComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClassauthComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClassauthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
