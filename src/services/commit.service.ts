import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {catchError, map, Observable, tap, throwError} from 'rxjs';
import {Commit} from "../types/commit";
import {environment} from "../environments/environment";
import {FileData} from "../types/file";

@Injectable({
  providedIn: 'root',
})

export class CommitService {
  private url: string = environment.apiUrl;

  constructor(private http: HttpClient) {
  }

  public getCommits(gitExecutablePath: string, repositoryPath: string, since: string = '1 day ago', until: string = 'now'): Observable<Commit[]> {
    const params = {
      'git_executable_path': gitExecutablePath,
      'repository_path': repositoryPath,
      'since': since,
      'until': until
    };

    const queryString = Object.entries(params)
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
      .join('&');

    const url = `${this.url}get-commits.php?${queryString}`;
    console.log('url', url);

    return this.http.get<CommitResponse>(url, {responseType: 'json'}).pipe(
      map((response: CommitResponse) => response.commits),
      map((commits: Commit[]) => commits.map(commit => ({...commit, isSelected: false}))),
      tap((commits: Commit[]) => console.log('Parsed Commits:', commits)),
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
    console.log(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}

interface CommitResponse {
  commits: Commit[];
}
