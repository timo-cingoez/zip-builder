import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {catchError, map, Observable, tap, throwError} from 'rxjs';
import {environment} from "../environments/environment";
import {FileData} from "../types/file";

@Injectable({
  providedIn: 'root',
})
export class FileService {
  private baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) {
  }

  public getAvailableFiles(): Observable<FileData[]> {
    const url = `${this.baseUrl}get-files.php`;
    return this.http.get<FileDataResponse>(url, {responseType: 'json'}).pipe(
      map((response: FileDataResponse) => response.files),
      map((files: FileData[]) => files.map(file => ({...file, isSelected: false}))),
      tap((files: FileData[]) => console.log('Parsed Files:', files)),
      catchError(this.handleError)
    );
  }

  public sendFiles(data: any): Observable<any> {
    const script = 'create-zip.php';
    console.log('data', data);
    console.log('url', `${this.baseUrl}${script}`);
    return this.http.post<string[]>(`${this.baseUrl}${script}`, data);
  }

  public download(filePath: string, fileName: string) {
    const script = 'download-file.php';
    const url = `${this.baseUrl}${script}?filepath=${filePath}`;

    // Set headers if needed (adjust accordingly)
    const headers = new HttpHeaders({
      'Content-Type': 'application/octet-stream',
    });

    this.http
      .get(url, {responseType: 'blob', headers, observe: 'response'})
      .subscribe((response) => {
        if (response.status === 200) {
          // Extract filename from Content-Disposition header
          const contentDisposition = response.headers.get('Content-Disposition');
          const filename = contentDisposition
            ? contentDisposition.split(';')[1].trim().split('=')[1]
            : 'downloaded-file.zip';

          // Trigger file download using window.open
          // @ts-ignore
          const blob = new Blob([response.body], {type: 'application/octet-stream'});
          const downloadLink = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = downloadLink;
          a.download = `${fileName}.zip`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
        } else {
          // Handle errors if needed
          console.error('File download failed:', response);
        }
      });
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

interface FileDataResponse {
  files: FileData[];
}
