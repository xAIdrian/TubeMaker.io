import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { from, Observable, Observer, of, Subject } from 'rxjs';
import { catchError, concatMap, map, tap } from 'rxjs/operators';

declare var gapi: any;

@Injectable({
  providedIn: 'root',
})
export class YoutubeService {
  private readonly BASE_URL = 'https://www.googleapis.com/youtube/v3';
  private readonly UPDATE_URL = 'https://www.googleapis.com/youtube/v3/channels?part=snippet';
  private readonly clientId =
    '355466863083-g129ts2hdg72gl5r3jiqrmg9i588cvqm.apps.googleusercontent.com';

  private identityTokenClient: any;
  private accessToken: string;

  private tokenSuccessSubjectObserver = new Subject<string>();

  constructor(private http: HttpClient) {}

  initTokenClient() {
    console.log(
      '🚀 ~ file: youtube.service.ts:24 ~ YoutubeService ~ initTokenClient ~ initTokenClient:'
    );
    //@ts-ignore
    this.identityTokenClient = google.accounts.oauth2.initTokenClient({
      client_id: this.clientId,
      scope: 
        'https://www.googleapis.com/auth/youtube.readonly \
        https://www.googleapis.com/auth/youtube.force-ssl \
        https://www.googleapis.com/auth/youtube',
      ux_mode: 'popup',
      // @ts-ignore
      callback: (tokenResponse) => {
        console.log(
          '🚀 ~ file: auth.service.ts:49 ~ tokenClientInit ~ tokenResponse:',
          tokenResponse
        );
        this.accessToken = tokenResponse.access_token;
        this.tokenSuccessSubjectObserver.next(this.accessToken);
      },
      error_callback: (error: any) => {
        console.log(
          '🚀 ~ file: auth.service.ts:55 ~ AuthService ~ tokenClientInit ~ e:',
          error
        );
        this.tokenSuccessSubjectObserver.next('');
      },
    });
  }

  requestAccessToken() {
    this.identityTokenClient.requestAccessToken();
  }

  getTokenSuccessObserver(): Observable<string> {
    return this.tokenSuccessSubjectObserver.asObservable();
  }

  getChannels(): Observable<any> {
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${this.accessToken}`
    );
    return this.http.get(`${this.BASE_URL}/channels?part=snippet&mine=true`, {
      headers,
    });
  }

  updateChannelUploadDefaults(
    channelId: string,
    uploadDefaultTitle: string,
    vidDefaultDesc: string
  ) {
    const body = {
      id: channelId,
      snippet: {
        title: uploadDefaultTitle,
        description: vidDefaultDesc,
      },
    };
    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${this.accessToken}`)

    return this.http.put(this.UPDATE_URL, body, { headers })
  }

  uploadChannelDefaultsForFirstChannel(
    uploadDefaultTitle: string,
    vidDefaultDesc: string
  ) {
    return this.updateChannelUploadDefaults(
      'UCI4DX-IyQ8KAGhPWE0Qr7Vg',
      'uploadDefaultTitle',
      'vidDefaultDesc'
    ).subscribe((res) => {
      console.log(
        '🚀 ~ file: youtube.service.ts:96 ~ YoutubeService ~ res:',
        res
      );
    });
    return this.getChannels().pipe(
      concatMap((channels) => {
        const firstChannel = channels.items[0];
        console.log("🚀 ~ file: youtube.service.ts:99 ~ YoutubeService ~ concatMap ~ firstChannel:", firstChannel)
        return this.updateChannelUploadDefaults(
          firstChannel.id,
          uploadDefaultTitle,
          vidDefaultDesc
        );
      }),
      catchError((err) => {
        console.log(
          '🚀 ~ file: youtube.service.ts:103 ~ YoutubeService ~ err:',
          err
        );
        return of(err);
      })
    );
  }
}
