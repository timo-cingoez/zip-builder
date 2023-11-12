import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {catchError, map, Observable, tap, throwError} from 'rxjs';
import {Commit} from "../types/commit";
import {environment} from "../environments/environment";

@Injectable({
  providedIn: 'root',
})

export class CommitService {
  private baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) {
  }

  public getCommits(): Observable<Commit[]> {
    const url = `${this.baseUrl}get-commits.php`;
    console.log(url);
    return this.http.get<CommitResponse>(url, {responseType: 'json'}).pipe(
      map((response: CommitResponse) => response.commits),
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
