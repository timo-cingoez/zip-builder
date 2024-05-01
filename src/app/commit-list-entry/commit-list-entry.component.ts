import {Component, Input} from '@angular/core';
import {Commit} from "../../types/commit";

@Component({
  selector: 'app-commit-list-entry',
  templateUrl: './commit-list-entry.component.html',
  styleUrls: ['./commit-list-entry.component.css']
})
export class CommitListEntryComponent {
  @Input() public commit!: Commit;

  ngOnInit() {
    console.log('commit', this.commit);
  }
}
