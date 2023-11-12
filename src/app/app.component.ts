import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FileService} from "../services/file.service";
import {CommitService} from "../services/commit.service";
import {Commit} from "../types/commit";
import {environment} from "../environments/environment";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  public title: string = 'P4N Update-Builder v1.1';

  public availableCommits: Set<Commit> = new Set();

  public selectedFiles: Set<string> = new Set();

  public availableFiles: Set<string> = new Set();

  public searchedFiles: Set<string> = new Set();

  public searchResultCount: number = 0;

  public availableFilesCount: number = 0;

  @ViewChild('downloadLink') downloadLink!: ElementRef;

  constructor(private fileService: FileService, private commitService: CommitService) {
  }

  public ngOnInit() {
    this.initAvailableFiles();
    this.initAvailableCommits();
  }

  public initAvailableCommits() {
    this.commitService.getCommits().subscribe({
      next: (response: Commit[]) => {
        this.availableCommits = new Set(response);
      },
      error: (error) => {
        console.error('Error fetching commits:', error);
      },
      complete: () => {
        console.log('initAvailableCommits finished');
      },
    });
  }

  public initAvailableFiles() {
    this.fileService.getAvailableFiles().subscribe({
      next: (files) => {
        this.availableFiles = new Set(files);
        this.availableFilesCount = this.availableFiles.size;
      },
      error: (error) => {
        console.error('Error fetching files:', error);
      },
      complete: () => {
        console.log('initAvailableFiles finished');
      },
    });
  }

  public selectCommitFiles(idx: number) {
    const commitsArray = Array.from(this.availableCommits);
    const selectedCommit: any = commitsArray[idx];
    selectedCommit.files.forEach((file: string) => this.selectFile(file));
  }

  public selectFile(filePath: string): void {
    this.availableFiles.delete(filePath);
    this.selectedFiles.add(filePath);
    this.selectedFiles = new Set(this.selectedFiles);
  }

  public unselectFile(filePath: string): void {
    this.selectedFiles.delete(filePath);
    this.availableFiles.add(filePath);
  }

  public searchFiles(searchText: any) {
    this.searchedFiles = new Set();

    this.availableFiles.forEach((fileName) => {
      if (fileName.includes(searchText)) {
        this.searchedFiles.add(fileName);
      }
    });

    this.searchResultCount = this.searchedFiles.size;

    console.log('searchText', searchText);
    console.log('this.searchedFiles', this.searchedFiles);
  }

  public initZip(): boolean {
    if (this.selectedFiles.size === 0) {
      alert('Warning: No files selected.');
      return false;
    }

    const data = {
      'action': 'BUILD_ZIP',
      'rootDir': environment.rootDir,
      'files': Array.from(this.selectedFiles)
    };

    this.fileService.sendFiles(data).subscribe({
      next: (response) => {
        console.log('response', response);
        this.fileService.download(response.filePaths.zip);
      },
      error: (error) => {
        console.error('error', error);
      },
      complete: () => {
        console.log('initZip finished');
      }
    });

    return true;
  }

  public resetSelectedFiles() {
    // TODO: Unselect all commits.
    this.selectedFiles = new Set();
  }
}
