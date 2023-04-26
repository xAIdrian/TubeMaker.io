import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import { concatMap, map, tap } from 'rxjs/operators';

declare var gapi: any;

@Injectable({
  providedIn: 'root',
})
export class YoutubeService {
  private readonly clientId = '355466863083-g129ts2hdg72gl5r3jiqrmg9i588cvqm.apps.googleusercontent.com';

  constructor() {  }

  private loadYouTubeApiClient() {
    return from(new Promise((resolve) => {
      gapi.load('client', resolve);
    }))
  }


  initYouTubeApiClient(): Observable<any> {
    return this.loadYouTubeApiClient().pipe(
      tap(() => console.log("🚀 ~ file: youtube.service.ts:26 ~ YoutubeService ~ initYouTubeApiClient ~ loadYouTubeApiClient:", 'client loaded')),
      concatMap(() => from(
        gapi.client.init({
            apiKey: 'AIzaSyDSfFtYPRdqAl79FyMko4110FGMP1wm1f8',
            discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest'],
            clientId: this.clientId,
        })))
    );
  }

  getChannels(accessToken: string) {
    console.log("🚀 ~ file: youtube.service.ts:35 ~ YoutubeService ~ getChannels ~ accessToken:", accessToken)
    gapi.client.setToken({ access_token: accessToken });
    from(
        gapi.client.youtube.channels.list({
            part: 'snippet,contentDetails,statistics',
            mine: true,
        })
    ).subscribe((response: any) => {
        console.log("🚀 ~ file: youtube.service.ts:43 ~ YoutubeService ~ getChannels ~ response:", response)
    });
  }  
}
