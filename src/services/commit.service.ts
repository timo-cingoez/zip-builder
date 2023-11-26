import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {catchError, map, Observable, tap, throwError} from 'rxjs';
import {Commit} from "../types/commit";
import {ConfigService} from "./config.service";
import {GitLogOptions} from "../types/gitlogoptions";

@Injectable({
  providedIn: 'root',
})
export class CommitService {
  private readonly url: string;

  constructor(private http: HttpClient, private configService: ConfigService) {
    this.url = configService.getApiUrl();
  }

  public getCommits(gitExecutablePath: string, repositoryPath: string, args: GitLogOptions): Observable<Commit[]> {
    const params = {
      'git_executable_path': gitExecutablePath,
      'repository_path': repositoryPath,
      'action': 'commits',
      ...args
    };
    this.configService.log('getCommits - params', params);

    const queryString = Object.entries(params)
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
      .join('&');

    const url = `${this.url}get-commits.php?${queryString}`;
    this.configService.log('getCommits - url', url);

    return this.http.get<CommitResponse>(url, {responseType: 'json'}).pipe(
      map((response: CommitResponse) => response.commits),
      map((commits: Commit[]) => commits.map(commit => ({...commit, isSelected: false}))),
      tap((commits: Commit[]) => this.configService.log('Parsed Commits:', commits)),
      catchError(this.handleError)
    );
  }

  public getAuthors(gitExecutablePath: string, repositoryPath: string) {
    const params = {
      'git_executable_path': gitExecutablePath,
      'repository_path': repositoryPath,
      'action': 'authors'
    };
    this.configService.log('getAuthors - params', params);

    const queryString = Object.entries(params)
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
      .join('&');

    const url = `${this.url}get-commits.php?${queryString}`;
    this.configService.log('getAuthors - url', url);

    return this.http.get<string[]>(url, {responseType: 'json'}).pipe(
      map((response: string[]) => response),
      tap((authors) => this.configService.log('Parsed Authors:', authors)),
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An error occurred';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    this.configService.log(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}

interface CommitResponse {
  commits: Commit[];
}
