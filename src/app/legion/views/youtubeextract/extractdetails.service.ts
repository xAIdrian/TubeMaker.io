import { TranscriptRepository } from '../../repository/transcript.repo';
import { Injectable } from '@angular/core';
import { from, map, Observable, Observer, of, Subject } from 'rxjs';
import { YoutubeDataRepository } from '../../repository/youtubedata.repo';
import { YoutubeVideo } from '../../model/video/youtubevideo.model';
import { NavigationService } from '../../service/navigation.service';
import { TextSplitUtility } from '../../helper/textsplit.utility';
import { ContentExtractionService } from '../../service/content/extract.service';
import { ExtractContentModel } from '../../model/extractcontent.model';

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
    private transcriptRepo: TranscriptRepository,
    private generationService: ContentExtractionService,
    private navigationService: NavigationService,
    private textSplitUtility: TextSplitUtility,
    private youtubeRepo: YoutubeDataRepository,
    private extractContentRepo: ExtractContentModel
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

  getTitleObserver() { return this.generationService.getTitleObserver(); }
  getDescriptionObserver() { return this.generationService.getDescriptionObserver(); }
  getTagsObserver() { return this.generationService.getTagsObserver(); }

  searchYoutubeVideos(niche: string) {
    // this.youtubeVideosSubject.next([
    //   {
    //     id: 'test',
    //     title: 'New Video Title',
    //     description: 'This is a description for the new video.',
    //     thumbnailUrl: 'https://i.ytimg.com/vi/WqKdr68YjBs/hqdefault.jpg',
    //     publishedAt: this.updateDateToHumanForm('2023-05-07T11:30:00Z'),
    //     channelTitle: 'Channel Title',
    //     statistics: {
    //         viewCount: '1000',
    //         likeCount: '500',
    //         commentCount: '100',
    //     },
    // },
    // {
    //     id: 'test',
    //     title: 'Another New Video',
    //     description: 'Check out this exciting new video!',
    //     thumbnailUrl: 'https://i.ytimg.com/vi/WqKdr68YjBs/hqdefault.jpg',
    //     publishedAt: this.updateDateToHumanForm('2023-05-08T13:45:00Z'),
    //     channelTitle: 'Channel Name',
    //     statistics: {
    //         viewCount: '2000',
    //         likeCount: '1000',
    //         commentCount: '200',
    //     },
    // },
    // {
    //     id: 'test',
    //     title: 'Amazing Video',
    //     description: 'This video will change your life.',
    //     thumbnailUrl: 'https://i.ytimg.com/vi/WqKdr68YjBs/hqdefault.jpg',
    //     publishedAt: this.updateDateToHumanForm('2023-05-09T15:00:00Z'),
    //     channelTitle: 'Amazing Channel',
    //     statistics: {
    //         viewCount: '5000',
    //         likeCount: '2500',
    //         commentCount: '500',
    //     },
    // },
    // {
    //     id: 'test',
    //     title: 'Funny Video',
    //     description: 'You will laugh out loud watching this video.',
    //     thumbnailUrl: 'https://i.ytimg.com/vi/WqKdr68YjBs/hqdefault.jpg',
    //     publishedAt: this.updateDateToHumanForm('2023-05-10T16:30:00Z'),
    //     channelTitle: 'Funny Channel',
    //     statistics: {
    //         viewCount: '3000',
    //         likeCount: '1500',
    //         commentCount: '300',
    //     },
    // },
    // {
    //     id: 'test',
    //     title: 'Interesting Video',
    //     description: 'This video will make you see the world in a different way.',
    //     thumbnailUrl: 'https://i.ytimg.com/vi/WqKdr68YjBs/hqdefault.jpg',
    //     publishedAt: this.updateDateToHumanForm('2023-05-11T14:00:00Z'),
    //     channelTitle: 'Interesting Channel',
    //     statistics: {
    //         viewCount: '4000',
    //         likeCount: '2000',
    //         commentCount: '400',
    //     },
    // }
    // ])
    // this.youtubeVideosSubject.complete();
    
    this.youtubeRepo.getVideoListByNiche(niche).subscribe({
      next: (videos) => {
            this.youtubeVideosSubject.next(videos);
          },
      error: (err) => {this.errorSubject.next(err); this.youtubeVideosSubject.complete();}
    });
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

    this.transcriptRepo.getTranscript('test').pipe(
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
    this.generationService.optimizeNewScriptIndex(prompt, section, index);
  }

  submitScript(transcriptSections: { isLoading: boolean; section: string; }[]) {
    of(transcriptSections).pipe(
      map((sections) => {
        const script: string[] = [];
        sections.forEach((section) => {
          script.push(section.section.trim());
        });
        return script
      })
    ).subscribe((scriptArray: string[]) => {
      this.extractContentRepo.updateCopyCatScript(scriptArray)
    });
    this.navigationService.navigateToTitleDetails();
  }

  getVideoMetaData() {
    if (this.currentCopyCatVideo === null || this.currentCopyCatVideo === undefined) {
      this.errorSubject.next('No videoId found. Sending placeholder for testing purposes.');
      // return; // uncomment for prod
      this.generationService.getNewTitle(
        'I Helped 1,000 Deaf People Hear For The First Time',
        'Thanks to Lickd for providing the music for this video! Discover tracks for your YouTube videos here: https://go.lickd.co/mb1'
      );
      this.generationService.getNewDescription(
        'I Helped 1,000 Deaf People Hear For The First Time',
        'Thanks to Lickd for providing the music for this video! Discover tracks for your YouTube videos here: https://go.lickd.co/mb1',
      );
      this.generationService.getNewTags(
        'I Helped 1,000 Deaf People Hear For The First Time',
        'Thanks to Lickd for providing the music for this video! Discover tracks for your YouTube videos here: https://go.lickd.co/mb1'
      )

      //test code above
    }
    //real code to uncomment below
    // this.generationService.updateNewTitle(this.currentCopyCatVideo.title);
    // this.generationService.updateNewDescription(this.currentCopyCatVideo.description);
    // this.generationService.updateNewTags(this.currentCopyCatVideo.tags);
  }

  updateTitle(prompt: string, current: string) { 
    this.generationService.optimizeTitle(prompt, current); 
  }

  updateDescription(prompt: string, current: string) { 
    this.generationService.optimizeDescription(prompt, current); 
  }

  updateTags() {
    this.generationService.getNewTags(
      this.currentCopyCatVideo.title,
      this.currentCopyCatVideo.description
    );
  }

  submitInfos(title: string,description: string,tags: string) {
    this.extractContentRepo.submitInfos(title, description, tags);
    this.navigationService.navigateToCopyCatMedia();
  }

  private updateDateToHumanForm(isoDate: string): string {
    const date = new Date(isoDate);
    const options = { month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' };
    return date.toLocaleString('fr-FR');
  }
}
