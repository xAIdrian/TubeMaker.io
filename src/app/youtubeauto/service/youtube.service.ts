import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { from, Observable, Observer, of, Subject } from 'rxjs';
import { catchError, concatMap, map, tap } from 'rxjs/operators';

declare var gapi: any;

@Injectable({
  providedIn: 'root',
})
export class YoutubeService {
  private readonly API_URL = 'https://www.googleapis.com/youtube/v3';
  private readonly clientId =
    '355466863083-g129ts2hdg72gl5r3jiqrmg9i588cvqm.apps.googleusercontent.com';
  
  private identityTokenClient: any;
  private accessToken: string;  

  private tokenSuccessSubjectObserver = new Subject<boolean>();

  constructor(private http: HttpClient) {}

  initTokenClient() {
    console.log("🚀 ~ file: youtube.service.ts:24 ~ YoutubeService ~ initTokenClient ~ initTokenClient:")
    //@ts-ignore
    this.identityTokenClient = google.accounts.oauth2.initTokenClient({
        client_id: this.clientId,
        scope: 'https://www.googleapis.com/auth/youtube.readonly',
        ux_mode: 'popup',
        // @ts-ignore
        callback: (tokenResponse) => {
          console.log(
            '🚀 ~ file: auth.service.ts:49 ~ tokenClientInit ~ tokenResponse:',
            tokenResponse
          );
          this.accessToken = tokenResponse.access_token;
          this.tokenSuccessSubjectObserver.next(true);
        },
        error_callback: (error: any) => {
          console.log(
            '🚀 ~ file: auth.service.ts:55 ~ AuthService ~ tokenClientInit ~ e:',
            error
          );
          this.tokenSuccessSubjectObserver.next(true);
        },
      });
  }

  requestAccessToken() {
    this.identityTokenClient.requestAccessToken();
  }

  getTokenSuccessObserver(): Observable<boolean> {
    return this.tokenSuccessSubjectObserver.asObservable();
  }

  getChannels(): Observable<any> {
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${this.accessToken}`
    );
    return this.http.get(`${this.API_URL}/channels?part=snippet&mine=true`, { headers });
  }
}
