import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommitListEntryComponent } from './commit-list-entry.component';

describe('CommitListEntryComponent', () => {
  let component: CommitListEntryComponent;
  let fixture: ComponentFixture<CommitListEntryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CommitListEntryComponent]
    });
    fixture = TestBed.createComponent(CommitListEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
