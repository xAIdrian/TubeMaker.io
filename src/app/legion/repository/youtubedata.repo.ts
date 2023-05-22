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
import { environment } from '../../../environments/environment';


// import { YOUTUBE_CLIENT_ID } from '../../appsecrets';

@Injectable({
  providedIn: 'root',
})
export class YoutubeDataRepository {

  constructor(
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
        url: `${environment.apiUrl}/api/youtube/videos/${currentLang}`,
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
}
