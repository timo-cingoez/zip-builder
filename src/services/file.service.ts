import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from "../environments/environment";

@Injectable({
  providedIn: 'root',
})
export class FileService {
  private baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) {
  }

  public getAvailableFiles(): Observable<string[]> {
    const script = 'get-files.php';
    return this.http.get<string[]>(`${this.baseUrl}${script}`);
  }

  public sendFiles(data: any): Observable<any> {
    const script = 'create-zip.php';
    console.log('data', data);
    console.log('url', `${this.baseUrl}${script}`);
    return this.http.post<string[]>(`${this.baseUrl}${script}`, data);
  }

  public download(filePath: string) {
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
          a.download = filename;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
        } else {
          // Handle errors if needed
          console.error('File download failed:', response);
        }
      });
  }
}
