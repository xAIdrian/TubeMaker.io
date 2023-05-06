import { TranscriptRepository } from './../repository/transcript.repo';
import { Injectable } from '@angular/core';
import { from, Observable, Observer, of, Subject } from 'rxjs';
import { YoutubeDataRepository } from '../repository/youtubedata.repo';
import { YoutubeVideo } from '../model/video/youtubevideo.model';
import { NavigationService } from './navigation.service';
import { TextSplitUtility } from '../helper/textsplit.utility';

declare var gapi: any;

@Injectable({
  providedIn: 'root',
})
export class YoutubeService {
  private errorSubject = new Subject<string>();

  private tokenSuccessSubject = new Subject<string>();
  private youtubeVideosSubject = new Subject<YoutubeVideo[]>();
  private videoTranscriptSubject = new Subject<string[]>();

  private currentCopyCatVideoId = '';

  constructor(
    private youtubeRepository: YoutubeDataRepository,
    private transcriptRepository: TranscriptRepository,
    private navigationService: NavigationService,
    private textSplitUtility: TextSplitUtility
  ) {}

  requestAccessToken() {
    this.youtubeRepository.getRequestToken().subscribe({
      /** */
    });
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

  getVideoTranscriptObserver(): Observable<string[]> {
    return this.videoTranscriptSubject.asObservable();
  }

  searchYoutubeVideos(niche: string) {
    this.youtubeVideosSubject.next([
      {
        id: 'WqKdr68YjBs',
        title: 'Top 5 Videos De FANTASMAS: Tu TÍO Te Esta Buscando...',
        description:
          'Bienvenido a Doc Tops. Desde algo en el bosque hasta un árabe tumbapuertas , estos son 5 fantasmas captados en cámara.',
        thumbnailUrl: 'https://i.ytimg.com/vi/WqKdr68YjBs/hqdefault.jpg',
        publishedAt: '2023-04-23T21:19:04Z',
        channelTitle: 'Doc Tops',
        statistics: {
          viewCount: '2233445',
          likeCount: '87654',
          commentCount: '12000',
        },
      }])
    
    // this.youtubeRepository.getVideoListByNiche(niche).subscribe({
    //   next: (videos) => this.youtubeVideosSubject.next(videos),
    //   error: (err) => this.errorSubject.next(err)
    // });
  }

  setCopyCatVideoId(videoId: string) {
    this.currentCopyCatVideoId = videoId;
    this.navigationService.navigateToExtractDetails();
  }

  getVideoTranscript() {
    if (this.currentCopyCatVideoId === '' || this.currentCopyCatVideoId === undefined) {
      this.errorSubject.next('No videoId found. Sending placeholder for testing purposes.');
      // return;
      this.currentCopyCatVideoId = 'test';
    }

    this.transcriptRepository.getTranscript(this.currentCopyCatVideoId).subscribe({
      next: (response: { message: string, result: { translation: string }}) => {
        console.log("🚀 ~ file: youtube.service.ts:108 ~ YoutubeService ~ this.transcriptRepository.getTranscript ~ response:", response)
        if (response.message !== 'success') {
          this.errorSubject.next(response.message);
          return
        } else if (response.result.translation.length === 0) {
          this.errorSubject.next('No transcript found');
          return;
        }
        this.videoTranscriptSubject.next(this.textSplitUtility.splitIntoParagraphs(response.result.translation));
      },
      error: (err) => {
        console.log(err);
        this.errorSubject.next(err);
      },
    });
  }
}
