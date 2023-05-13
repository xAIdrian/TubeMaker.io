import { TranscriptRepository } from '../../repository/transcript.repo';
import { Injectable } from '@angular/core';
import { concatMap, from, map, Observable, Observer, of, Subject, tap } from 'rxjs';
import { YoutubeDataRepository } from '../../repository/youtubedata.repo';
import { YoutubeVideo } from '../../model/video/youtubevideo.model';
import { NavigationService } from '../../service/navigation.service';
import { TextSplitUtility } from '../../helper/textsplit.utility';
import { ExtractionContentService } from '../../service/content/extractcontent.service';
import { ExtractContentRepository } from '../../repository/content/extractcontent.repo';
import { formatDistance } from 'date-fns'

@Injectable({
  providedIn: 'root',
})
export class ExtractDetailsService {
  
  private errorSubject = new Subject<string>();
  private kickBackErrorSubject = new Subject<string>();
  private isTranscriptLoadingSubject = new Subject<boolean>();

  private youtubeVideosSubject = new Subject<YoutubeVideo[]>();
  private videoTranscriptSubject = new Subject<{ isLoading: boolean, section: string }[]>();

  private currentCopyCatVideo: YoutubeVideo;

  constructor(
    private transcriptRepo: TranscriptRepository,
    private generationService: ExtractionContentService,
    private navigationService: NavigationService,
    private textSplitUtility: TextSplitUtility,
    private youtubeRepo: YoutubeDataRepository,
    private extractContentRepo: ExtractContentRepository
  ) {}

  getErrorObserver(): Observable<string> {
    return this.errorSubject.asObservable();
  }

  getKickBackErrorObserver(): Observable<string> {
    return this.kickBackErrorSubject.asObservable();
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

  getTitleObserver() { 
    return this.generationService.getTitleObserver().pipe(
      tap((title) => {
        this.extractContentRepo.updateTitle(title)
      })
    ); 
  }
  getDescriptionObserver() { 
    return this.generationService.getDescriptionObserver().pipe(
      tap((description) => {
        this.extractContentRepo.updateDescription(description)
      })
    ); 
  }
  getTagsObserver() { 
    return this.generationService.getTagsObserver().pipe(
      tap((tags) => {
        this.extractContentRepo.updateTags(tags)
      })
    ); 
  }

  getCurrentVideoUrl(): string {
    return `https://www.youtube.com/embed/${this.currentCopyCatVideo.id}`
  }

  searchYoutubeVideos(niche: string) {
    this.youtubeRepo.getVideoListByNiche(niche).pipe(
      map((videos) => videos.map((video) => {
        const cleanedText = video.title.replace(/&#39;/g, "'").replace(/&quot;/g, '"').replace(/&amp;/g, '&').replace(/&gt;/g, '>').replace(/&lt;/g, '<');
        return {
          ...video,
          title: cleanedText,
          publishedAt: this.updateDateToHumanForm(video.publishedAt),
          statistics: {
            viewCount: this.getRandomNumber(),
            likeCount: this.getRandomNumber(),
            commentCount: this.getRandomNumber(),
          }
        }
      }))
    ).subscribe({
      next: (videos) => {
            this.youtubeVideosSubject.next(videos);
          },
      error: (err) => {
        console.log("🔥 ~ file: extractdetails.service.ts:148 ~ ExtractDetailsService ~ this.youtubeRepo.getVideoListByNiche ~ err:", err)
        this.errorSubject.next(err); 
        this.youtubeVideosSubject.complete();
      }
    });
  }

  setCopyCatVideoId(video: YoutubeVideo) {
    this.extractContentRepo.setCurrentPageObject(video).subscribe({
      next: (response) => {
        this.currentCopyCatVideo = video;
        this.navigationService.navigateToExtractDetails();
      },
      error: (err) => {
        this.errorSubject.next(err);
      }
    });
  }

  getVideoTranscript() {
    if (this.currentCopyCatVideo === null || this.currentCopyCatVideo === undefined) {
      this.errorSubject.next('No videoId found. Sending placeholder for testing purposes.');
      return; // uncomment for prod
    } 

    // this.transcriptRepo.getTranscript('test').pipe(
    this.transcriptRepo.getTranscript(this.currentCopyCatVideo.id).pipe(
    ).subscribe({
      next: (response: { message: string, result: { translation: string }}) => {
        if (response.message !== 'success' || response.result.translation === '') {
          this.errorSubject.next(response.message);
          return;
        }
        if (response.result.translation === '') {
          this.errorSubject.next('No transcript found.');
          return;
        }

        const uiPreppedResponse: { isLoading: boolean, section: string }[] = [];
        const splitParagraphs = this.textSplitUtility.splitIntoParagraphs(response.result.translation)
        this.extractContentRepo.updateCopyCatScript(splitParagraphs)

        splitParagraphs.forEach((paragraph) => {
          uiPreppedResponse.push({ isLoading: false, section: paragraph.trim() });
        });

        this.videoTranscriptSubject.next(uiPreppedResponse);
        this.isTranscriptLoadingSubject.next(false);
      },
      error: (err) => {
        if (err = 'Error: Request failed with status code 505') {
          this.kickBackErrorSubject.next('Seems like the video you selected is not available for translation. Please select another video.');
        } else {
          console.log("🔥 ~ file: extractdetails.service.ts:122 ~ ExtractDetailsService ~ getVideoTranscript ~ err:", err)
          this.errorSubject.next(err);
        }
      },
    });
  }

  updateNewScriptIndex(prompt: string, section: string, index: number) {
    this.generationService.optimizeNewScriptIndex(prompt, section, index);
  }

  updateScript(transcriptSections: { isLoading: boolean; section: string; }[]) {
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
      return
    }
    //real code to uncomment below
    this.generationService.getNewTitle(
      this.currentCopyCatVideo.description,
      this.currentCopyCatVideo.title
    );
    this.generationService.getNewDescription(
      this.currentCopyCatVideo.title,
      this.currentCopyCatVideo.description
    );
    this.generationService.getNewTags(
      this.currentCopyCatVideo.title,
      this.currentCopyCatVideo.description
    );
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

  submitSave(
    generatedAudioUrl: string,
    title: string, 
    description: string, 
    tags: string,
    script: string[]
  ) {
    this.extractContentRepo
      .submitCompleteInfos(generatedAudioUrl, title, description, tags, script)
      .subscribe({
        next: (response) => {
          this.kickBackErrorSubject.next('Save successful.');
        },
        error: (err) => {
          this.errorSubject.next(err);
        }
      })
  }

  clearCurrentVideoPage() {
    this.extractContentRepo.clearCurrentPage();
  }

  getRandomNumber(): string {
    return Math.floor(Math.random() * (3000000 - 500000 + 1) + 500000).toString();
  }
  
  navigateHome() {
    this.navigationService.navigateToCopyCat();
  }

  private updateDateToHumanForm(isoDate: string): string {
    const date = new Date(isoDate);
    return formatDistance(date, new Date(), { addSuffix: true })
  }  
}
