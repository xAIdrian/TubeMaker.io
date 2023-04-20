import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError, interval } from 'rxjs';
import { catchError, map, switchMap, takeWhile } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class VoiceService {

  constructor(
    private http: HttpClient
  ) {}

  private baseUrl = 'http://localhost:3000';

  private headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': 'Bearer 5992824d1a1b4779a76e4176ca0d1d07',
    'X-USER-ID': 'Y0Yo31zn6ofKRyhNFyNj1gSxEJ63'
  });

  getArticleStatus(transcriptionId: string): Observable<any> {
    const url = `${this.baseUrl}/api/article-status?transcriptionId=${transcriptionId}`;
    return interval(5000).pipe(
      switchMap(() => this.http.get(url, { headers: this.headers })),
      map((response: any) => {
        if (response.converted) {
          return response;
        } else {
          throw new Error('Transcription still in progress.');
        }
      }),
      takeWhile((response: any) => !response.converted, true),
      catchError(error => throwError(error))
    );
  }

  
}
