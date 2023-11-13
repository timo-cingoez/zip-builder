import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FileService} from "../services/file.service";
import {CommitService} from "../services/commit.service";
import {Commit} from "../types/commit";
import {environment} from "../environments/environment";
import {FileData} from "../types/file";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  public title: string = 'P4N Update-Builder v1.1';

  public availableCommits: Set<Commit> = new Set();

  public selectedFiles: Set<string> = new Set();

  public fileDataList: FileData[] = [];

  public searchedFiles: Set<FileData> = new Set();

  public searchResultCount: number = 0;

  public availableFilesCount: number = 0;

  @ViewChild('downloadLink') downloadLink!: ElementRef;

  constructor(private fileService: FileService, private commitService: CommitService) {
  }

  public ngOnInit() {
    this.initFileDataList();
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

  public initFileDataList(): void {
    this.fileService.getAvailableFiles().subscribe({
      next: (files) => {
        this.fileDataList = files;
        this.availableFilesCount = this.fileDataList.length;
      },
      error: (error) => {
        console.error('Error fetching files:', error);
      },
      complete: () => {
        console.log('initAvailableFiles finished');
      },
    });
  }

  public onCommitClick(commit: Commit) {
    if (commit.isSelected) {
      commit.isSelected = false;
      commit.files.forEach((file: string) => this.unselectFile(file));
    } else {
      commit.isSelected = true;
      commit.files.forEach((file: string) => this.selectFile(file));
    }
  }

  public selectFile(filePath: string): void {
    const selectedObj = this.fileDataList.find((fileData) => fileData.path === filePath);
    if (selectedObj) {
      selectedObj.isSelected = true;
    } else {
      console.error(`Selected file ${filePath} not found. (very bad)`);
    }

    this.selectedFiles.add(filePath);
    this.selectedFiles = new Set(this.selectedFiles);
  }

  public unselectFile(filePath: string): void {
    this.selectedFiles.delete(filePath);
    this.selectedFiles = new Set(this.selectedFiles);
    const selectedObj = this.fileDataList.find((fileData) => fileData.path === filePath);
    if (selectedObj) {
      selectedObj.isSelected = false;

      for (const commit of this.availableCommits) {
        commit.isSelected = commit.files.every(path => this.selectedFiles.has(path));
      }
    } else {
      console.error(`Selected file ${filePath} not found.`);
    }
  }

  public searchFiles(searchText: any) {
    this.searchedFiles = new Set();

    this.fileDataList.forEach((fileData: FileData) => {
      if (fileData.path.includes(searchText)) {
        this.searchedFiles.add(fileData);
      }
    });

    this.searchResultCount = this.searchedFiles.size;

    // console.log('searchText', searchText);
    // console.log('this.searchedFiles', this.searchedFiles);
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

  public reset() {
    this.selectedFiles = new Set();
    this.searchedFiles = new Set();
    this.fileDataList.forEach((fileData) => fileData.isSelected = false);
    for (const commit of this.availableCommits) {
      commit.isSelected = false;
    }
  }
}
