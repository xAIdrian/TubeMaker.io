import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import {
  Observable,
  catchError,
  of,
  map,
  concatMap,
  from,
} from 'rxjs';
import { YoutubeVideo } from '../model/video/youtubevideo.model';
import axios, { AxiosRequestConfig } from 'axios';
import { TranslateService } from '@ngx-translate/core';

// import { YOUTUBE_CLIENT_ID } from '../../appsecrets';

@Injectable({
  providedIn: 'root',
})
export class YoutubeDataRepository {
  private readonly BASE_URL = 'https://www.googleapis.com/youtube/v3';
  private readonly UPDATE_URL =
    'https://www.googleapis.com/youtube/v3/channels';

  private identityTokenClient: any;
  private accessToken: string;

  constructor(
    private http: HttpClient,
    private translate: TranslateService
    ) {
    /** */
    }

  private oneMonthAgoIsoDate(): string {
    const oneMonthAgoDate = new Date();
    oneMonthAgoDate.setDate(oneMonthAgoDate.getDate() - 30);
    const isoDate = oneMonthAgoDate.toISOString();
    return isoDate;
  }

  getVideoListByNiche(niche: string): Observable<YoutubeVideo[]> {
    const currentLang = this.translate.currentLang;
    const config: AxiosRequestConfig = {
        method: 'get',
        url: `http://localhost:3000/api/youtube/videos/${currentLang}`,
        params: {
            niche: niche,
            publishedAfter: this.oneMonthAgoIsoDate(),
        },
        maxContentLength: Infinity,
        maxBodyLength: Infinity
    };
    return from(axios(config)).pipe(
        map((response) => { return response.data;  })
    );
  }

  getRequestToken(): Observable<string> {
    return of(this.identityTokenClient.requestAccessToken());
  }

  initTokenClient() {
    console.log(
      '🚀 ~ file: youtube.service.ts:24 ~ YoutubeService ~ initTokenClient ~ initTokenClient:'
    );
    //@ts-ignore
    this.identityTokenClient = google.accounts.oauth2.initTokenClient({
      //   client_id: YOUTUBE_CLIENT_ID,
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
        // this.tokenSuccessSubjectObserver.next(this.accessToken);
      },
      error_callback: (error: any) => {
        console.log(
          '🚀 ~ file: auth.service.ts:55 ~ AuthService ~ tokenClientInit ~ e:',
          error
        );
        // return of(this.tokenSuccessSubjectObserver.next('');)
      },
    });
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
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${this.accessToken}`
    );

    return this.http.put(this.UPDATE_URL, body, { headers });
  }

  uploadChannelDefaultsForFirstChannel(
    uploadDefaultTitle: string,
    vidDefaultDesc: string
  ) {
    return this.getChannels().pipe(
      concatMap((channels) => {
        const firstChannel = channels.items[0];
        console.log(
          '🚀 ~ file: youtube.service.ts:99 ~ YoutubeService ~ concatMap ~ firstChannel:',
          firstChannel
        );
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
