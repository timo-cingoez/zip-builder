import {Injectable} from "@angular/core";
import {AppConfig} from "../types/appconfig";

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  private config: AppConfig = {
    apiUrl: '',
    repositoryPath: '',
    gitExecutablePath: '',
    excludedDirs: [],
    DEBUG: false
  };

  public async load(): Promise<void> {
    return fetch('assets/config.json')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data: AppConfig) => {
        this.config = data;
        this.log('load - config', data);
      })
      .catch((error: any) => {
        console.log('Error loading configuration:', error);
        throw error;
      });
  }

  public getApiUrl(): string {
    return this.config.apiUrl;
  }

  public getGitExecutablePath(): string {
    return this.config.gitExecutablePath;
  }

  public getRepositoryPath(): string {
    return this.config.repositoryPath;
  }

  public getExcludedDirs(): string[] {
    return this.config.excludedDirs;
  }

  public log(...args: any) {
    this.config.DEBUG ? console.log(...args) : null;
  }
}
