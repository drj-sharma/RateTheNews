import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PublishedArticlesComponent } from './published-articles.component';

describe('PublishedArticlesComponent', () => {
  let component: PublishedArticlesComponent;
  let fixture: ComponentFixture<PublishedArticlesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PublishedArticlesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PublishedArticlesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
