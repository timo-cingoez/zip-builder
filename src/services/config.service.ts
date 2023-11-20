import {Injectable} from "@angular/core";
import {AppConfig} from "../types/appconfig";

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  private config: AppConfig = {
    apiUrl: '',
    repositoryPath: '',
    gitExecutablePath: ''
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
        console.log('config', data);
        this.config = data;
      })
      .catch((error: any) => {
        console.error('Error loading configuration:', error);
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
}
