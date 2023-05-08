import { TranscriptRepository } from '../../repository/transcript.repo';
import { Injectable } from '@angular/core';
import { from, map, Observable, Observer, of, Subject } from 'rxjs';
import { YoutubeDataRepository } from '../../repository/youtubedata.repo';
import { YoutubeVideo } from '../../model/video/youtubevideo.model';
import { NavigationService } from '../../service/navigation.service';
import { TextSplitUtility } from '../../helper/textsplit.utility';
import { ContentGenerationService } from '../../service/contentgeneration.service';

declare var gapi: any;

@Injectable({
  providedIn: 'root',
})
export class ExtractDetailsService {
  
  private errorSubject = new Subject<string>();
  private isTranscriptLoadingSubject = new Subject<boolean>();

  private youtubeVideosSubject = new Subject<YoutubeVideo[]>();
  private videoTranscriptSubject = new Subject<{ isLoading: boolean, section: string }[]>();

  private currentCopyCatVideo: YoutubeVideo;

  constructor(
    private transcriptRepository: TranscriptRepository,
    private generationService: ContentGenerationService,
    private navigationService: NavigationService,
    private textSplitUtility: TextSplitUtility
  ) {}

  getErrorObserver(): Observable<string> {
    return this.errorSubject.asObservable();
  }

  getTranscriptIsLoadingObserver(): Observable<boolean> {
    return this.isTranscriptLoadingSubject.asObservable();
  }

  getYoutubeVideosObserver(): Observable<YoutubeVideo[]> {
    return this.youtubeVideosSubject.asObservable();
  }

  getVideoTranscriptObserver(): Observable<{ isLoading: boolean, section: string }[]> {
    return this.videoTranscriptSubject.asObservable();
  }

  getScriptSectionObserver(): Observable<{
    scriptSection: string
    sectionIndex: number
  }> {
    return this.generationService.getScriptSectionObserver().pipe(
      map((scriptSection) => {
        console.log("🚀 ~ file: extractdetails.service.ts:54 ~ ExtractDetailsService ~ map ~ scriptSection:", scriptSection)
        return {
          scriptSection: scriptSection.scriptSection.trim(),
          sectionIndex: scriptSection.position as number
        }
      })
    );
  }

  searchYoutubeVideos(niche: string) {
    this.youtubeVideosSubject.next([
      {
        id: 'test',
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
    this.youtubeVideosSubject.complete();
    
    // this.youtubeRepository.getVideoListByNiche(niche).subscribe({
    //   next: (videos) => {
          //   this.youtubeVideosSubject.next(videos);
          //   this.youtubeVideosSubject.complete();
          // },
    //   error: (err) => {this.errorSubject.next(err); this.youtubeVideosSubject.complete();}
    // });
  }

  setCopyCatVideoId(video: YoutubeVideo) {
    this.currentCopyCatVideo = video;
    this.navigationService.navigateToExtractDetails();
  }

  getVideoTranscript() {
    console.log("🚀 ~ file: youtube.service.ts:90 ~ YoutubeService ~ getVideoTranscript ~ getVideoTranscript:", 'getVideoTranscript')
    if (this.currentCopyCatVideo === null || this.currentCopyCatVideo === undefined) {
      this.errorSubject.next('No videoId found. Sending placeholder for testing purposes.');
      // return; // uncomment for prod
    }

    this.transcriptRepository.getTranscript('test').pipe(
    // this.transcriptRepository.getTranscript(this.currentCopyCatVideo.id).pipe(
    ).subscribe({
      next: (response: { message: string, result: { translation: string }}) => {
        if (response.message !== 'success' || response.result.translation.length === 0) {
          this.errorSubject.next(response.message);
          this.errorSubject.complete();
          return
        }
        const uiPreppedResponse: { isLoading: boolean, section: string }[] = [];
        const splitParagraphs = this.textSplitUtility.splitIntoParagraphs(response.result.translation)
        splitParagraphs.forEach((paragraph) => {
          uiPreppedResponse.push({ isLoading: false, section: paragraph.trim() });
        });

        this.videoTranscriptSubject.next(uiPreppedResponse);
        this.isTranscriptLoadingSubject.next(false);
        this.videoTranscriptSubject.complete();
      },
      error: (err) => {
        console.log("🔥 ~ file: extractdetails.service.ts:122 ~ ExtractDetailsService ~ getVideoTranscript ~ err:", err)
        this.errorSubject.next(err);
        this.errorSubject.complete
      },
    });
  }

  updateNewScriptIndex(prompt: string, section: string, index: number) {
    this.generationService.updateNewScriptIndex(prompt, section, index);
  }

  submitScript(transcriptSections: { isLoading: boolean; section: string; }[]) {
    this.navigationService.navigateToTitleDetails();
      throw new Error("Method not implemented.");
  }
}
