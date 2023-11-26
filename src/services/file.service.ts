import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {catchError, map, Observable, tap, throwError} from 'rxjs';
import {FileData} from "../types/file";
import {ConfigService} from "./config.service";

@Injectable({
  providedIn: 'root',
})
export class FileService {
  private readonly baseUrl;

  constructor(private http: HttpClient, private configService: ConfigService) {
    this.baseUrl = configService.getApiUrl();
  }

  public getAvailableFiles(repositoryPath: string, excludedDirs: string[]): Observable<FileData[]> {
    const url = `${this.baseUrl}get-files.php?repository_path=${repositoryPath}`;
    this.configService.log('getAvailableFiles - url', url);

    const body = {
      'exclude_dirs': excludedDirs
    };
    this.configService.log('getAvailableFiles - data', body);

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post<FileDataResponse>(url, body, {headers, responseType: 'json'}).pipe(
      map((response: FileDataResponse) => response.files),
      map((files: FileData[]) => files.map(file => ({...file, isSelected: false}))),
      tap((files: FileData[]) => this.configService.log('Parsed Files:', files)),
      catchError(this.handleError)
    );
  }

  public sendFiles(data: any): Observable<any> {
    const url = `${this.baseUrl}create-zip.php`
    this.configService.log('sendFiles - url', url);
    this.configService.log('sendFiles - data', data);
    return this.http.post<string[]>(url, data);
  }

  public download(filePath: string, fileName: string) {
    const script = 'download-file.php';
    const url = `${this.baseUrl}${script}?filepath=${filePath}`;
    this.configService.log('download - url', url);

    const headers = new HttpHeaders({
      'Content-Type': 'application/octet-stream',
    });

    this.http
      .get(url, {responseType: 'blob', headers, observe: 'response'})
      .subscribe((response) => {
        if (response.status === 200) {
          // Trigger file download using window.open, will refactor in future
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
          this.configService.log('File download failed:', response);
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
    this.configService.log(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}

interface FileDataResponse {
  files: FileData[];
}
