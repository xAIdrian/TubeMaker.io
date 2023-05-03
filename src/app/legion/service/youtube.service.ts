import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { from, Observable, Observer, of, Subject } from 'rxjs';
import { YoutubeDataRepository } from '../repository/youtubedata.repo';
import { YoutubeVideo } from '../model/video/youtubevideo.model';

declare var gapi: any;

@Injectable({
  providedIn: 'root',
})
export class YoutubeService {

  private tokenSuccessSubject = new Subject<string>();
  private errorSubject = new Subject<string>();
  private youtubeVideosSubject = new Subject<YoutubeVideo[]>();

  constructor(
    private youtubeRepository: YoutubeDataRepository
  ) {}

  requestAccessToken() {
    this.youtubeRepository.getRequestToken().subscribe({ /** */ });
  }

  getTokenSuccessObserver(): Observable<string> {
    return this.tokenSuccessSubject.asObservable();
  }

  getErrorObserver(): Observable<string> {
    return this.errorSubject.asObservable();
  }

  getYoutubeVideosObserver(): Observable<YoutubeVideo[]> {
    return this.youtubeVideosSubject.asObservable();
  }

  searchYoutubeVideos(niche: string) {
    this.youtubeRepository.getVideoListByNiche(niche).subscribe({
      next: (videos) => this.youtubeVideosSubject.next(videos),
      error: (err) => this.errorSubject.next(err)
    });
  }
}
