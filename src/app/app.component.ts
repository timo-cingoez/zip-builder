import {Component, OnInit} from '@angular/core';
import {FileService} from "../services/file.service";
import {CommitService} from "../services/commit.service";
import {Commit} from "../types/commit";
import {FileData} from "../types/file";
import {ConfigService} from "../services/config.service";
import {GitLogOptions} from "../types/gitlogoptions";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  public title: string = 'P4N Update-Builder';

  public version: string = 'v1.1';

  public repositoryPath: string;

  public gitLogOptions: GitLogOptions = {
    since: '1 day ago',
    until: 'now',
    author: '',
    grep: ''
  };

  public allCommitsSelected: boolean = false;

  public infoPanelVisible: boolean = false;

  public gitInfoPanelVisible: boolean = false;

  public zipName: string = 'zip_builder_' + new Date().getTime();

  public availableCommits: Set<Commit> = new Set();

  public commitAuthors: Set<string> = new Set();

  public selectedFiles: Set<FileData> = new Set();

  public fileDataList: FileData[] = [];

  public searchedFiles: Set<FileData> = new Set();

  public searchResultCount: number = 0;

  public availableFilesCount: number = 0;

  public excludedDirs = [
    'DEBUG',
    'dokumente',
    'bilder',
    'images',
    'emoticons',
    'log',
    'dokumente_korrespondenz',
    'img',
    'Serienbriefe',
    'export',
    'temp',
    'bdc posteingang',
    '.git',
    '.idea',
    '.github',
    '.tmb',
    'mailbox_emails',
    'stil',
    'faq',
    'sensus',
    '.gitignore',
    'log.txt',
    'vendor',
    'leads',
    '2.0',
    'boersen',
    'archive',
    'lds'
  ].join(', ');

  public supportedExtensionImages = [
    'css',
    'gif',
    'html',
    'php',
    'jpg',
    'png',
    'js',
    'json',
    'phtml',
    'txt',
    'xml'
  ];

  constructor(
    private fileService: FileService,
    private commitService: CommitService,
    private configService: ConfigService
  ) {
    this.repositoryPath = this.configService.getRepositoryPath();
  }

  public ngOnInit() {
    this.initFileDataList();
    this.initAvailableCommits();
    this.initCommitAuthors();
  }

  public initAvailableCommits() {
    this.availableCommits = new Set();
    this.commitService.getCommits(
      this.configService.getGitExecutablePath(),
      this.configService.getRepositoryPath(),
      this.gitLogOptions
    )
      .subscribe({
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
    this.fileService.getAvailableFiles(this.configService.getRepositoryPath()).subscribe({
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
      commit.files.forEach((file: string) => {
        const fileData = [...this.selectedFiles].find(obj => obj.path === file);
        if (fileData) {
          this.unselectFile(fileData);
        }
      });
    } else {
      commit.isSelected = true;
      commit.files.forEach((file: string) => {
        const fileData = this.fileDataList.find(obj => obj.path === file);
        if (fileData) {
          this.selectFile(fileData);
        }
      });
    }
    this.checkAllCommitsSelected();
  }

  public onSearchedFileClick(fileData: FileData) {
    if (fileData.isSelected) {
      fileData.isSelected = false;
      this.unselectFile(fileData);
    } else {
      fileData.isSelected = true;
      this.selectFile(fileData);
    }
  }

  public selectFile(fileData: FileData): void {
    fileData.isSelected = true;
    this.selectedFiles.add(fileData);
    this.selectedFiles = new Set(this.selectedFiles);

    for (const commit of this.availableCommits) {
      commit.isSelected = commit.files.every(path => [...this.selectedFiles].some(obj => obj.path === path));
    }

    this.checkAllCommitsSelected();
  }

  public unselectFile(fileData: FileData): void {
    this.selectedFiles.delete(fileData);
    this.selectedFiles = new Set(this.selectedFiles);

    fileData.isSelected = false;

    for (const commit of this.availableCommits) {
      commit.isSelected = commit.files.every(path => [...this.selectedFiles].some(obj => obj.path === path));
    }

    this.checkAllCommitsSelected();
  }

  public searchFiles(searchText: any) {
    this.searchedFiles = new Set();

    if (searchText) {
      this.fileDataList.forEach((fileData: FileData) => {
        if (fileData.path.includes(searchText)) {
          this.searchedFiles.add(fileData);
        }
      });
    }

    this.searchResultCount = this.searchedFiles.size;

    // console.log('searchText', searchText);
    // console.log('this.searchedFiles', this.searchedFiles);
  }

  public initZip(): boolean {
    if (this.selectedFiles.size === 0) {
      alert('Warning: No files selected.');
      return false;
    }

    const files: string[] = [...this.selectedFiles].map(fileData => fileData.path);

    const data = {
      'action': 'BUILD_ZIP',
      'rootDir': this.configService.getRepositoryPath(),
      'files': files
    };

    this.fileService.sendFiles(data).subscribe({
      next: (response) => {
        console.log('response', response);
        this.fileService.download(response.filePaths.zip, this.zipName);
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
    this.zipName = 'zip_builder_' + new Date().getTime();
  }

  public toggleInfoPanelVisibility() {
    this.infoPanelVisible = !this.infoPanelVisible;
  }

  public toggleGitPanelVisibility() {
    this.gitInfoPanelVisible = !this.gitInfoPanelVisible;
  }

  public doesExtensionImageExist(extension: string) {
    return this.supportedExtensionImages.includes(extension);
  }

  public selectAllCommits(): void {
    for (const commit of this.availableCommits) {
      commit.isSelected = false;
      this.onCommitClick(commit);
    }
  }

  public unselectAllCommits(): void {
    for (const commit of this.availableCommits) {
      commit.isSelected = true;
      this.onCommitClick(commit);
    }
  }

  public onCommitSelectAllClick() {
    if (this.allCommitsSelected) {
      this.unselectAllCommits();
    } else {
      this.selectAllCommits();
    }
  }

  public checkAllCommitsSelected() {
    let allCommitsSelected = true;
    for (const commit of this.availableCommits) {
      if (!commit.isSelected) {
        allCommitsSelected = false;
        break;
      }
    }
    this.allCommitsSelected = allCommitsSelected;
  }

  public initCommitAuthors() {
    this.commitService.getAuthors(
      this.configService.getGitExecutablePath(),
      this.configService.getRepositoryPath()
    )
      .subscribe({
        next: (response: string[]) => {
          this.commitAuthors = new Set(response);
        },
        error: (error) => {
          console.error('Error fetching authors:', error);
        },
        complete: () => {
          console.log('initCommitAuthors finished');
        },
      });
  }
}
