import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { Observable, throwError, Subject, catchError, of } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class YoutubeDataRepository {
  constructor(
    private http: HttpClient
) {
    /** */
  }

  getVideoListByNiche(niche: string): Observable<any> {
    return this.http.get<any>('http://localhost:3000/api/youtube/videos');
  }
}
