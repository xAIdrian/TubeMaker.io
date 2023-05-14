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
import { YoutubeService } from '../common/youtube.service';

@Injectable({
  providedIn: 'root',
})
export class YoutubeExtractService extends YoutubeService {

  private youtubeVideosSubject = new Subject<YoutubeVideo[]>();
  private videoTranscriptSubject = new Subject<{ isLoading: boolean, section: string }[]>();

  private currentCopyCatVideo: YoutubeVideo;

  constructor(
    protected override generationService: ExtractionContentService,
    protected override navigationService: NavigationService,
    private transcriptRepo: TranscriptRepository,
    private textSplitUtility: TextSplitUtility,
    private youtubeRepo: YoutubeDataRepository,
    private extractContentRepo: ExtractContentRepository
  ) {
    super(
      generationService,
      navigationService,
      extractContentRepo
    );
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

  getCurrentVideoUrl(): string {
    if (this.currentCopyCatVideo === null || this.currentCopyCatVideo === undefined) {
      this.navigationService.navigateToCopyCat();
    }
    return `https://www.youtube.com/embed/${this.currentCopyCatVideo.id}`
  }

  isCurrentVideoPresent() {
    return this.currentCopyCatVideo !== null && this.currentCopyCatVideo !== undefined;
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
        if (response !== null && response !== undefined) {
          this.navigationService.navigateToExtractDetails();
        }
      },
      error: (err) => {
        this.errorSubject.next(err);
      }
    });
  }

  getNewVideoTranscript() {
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

  getVideoTranscript() {
    this.extractContentRepo.getCompleteScript().subscribe({
      next: (script) => {
        if (script === null || script === undefined || script.length === 0) {
          this.getNewVideoTranscript();
          return;
        } else {
          const uiPreppedResponse: { isLoading: boolean, section: string }[] = [];
          const splitParagraphs = this.textSplitUtility.splitIntoParagraphs(script)

          splitParagraphs.forEach((paragraph) => {
            uiPreppedResponse.push({ isLoading: false, section: paragraph.trim() });
          });

          this.videoTranscriptSubject.next(uiPreppedResponse);
          this.isTranscriptLoadingSubject.next(false);
        }
      },
      error: (err) => {
        this.errorSubject.next(err);
      }
    });
  }

  updateTags() {
    this.generationService.getNewTags(
      this.currentCopyCatVideo.title,
      this.currentCopyCatVideo.description
    );
  }

  getNewVideoMetaData() {
    if (this.currentCopyCatVideo === null || this.currentCopyCatVideo === undefined) {
      this.errorSubject.next('No videoId found. Sending placeholder for testing purposes.');
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

  clearCurrentVideoPage() {
    this.extractContentRepo.clearCurrentPage();
  }

  getRandomNumber(): string {
    return Math.floor(Math.random() * (3000000 - 500000 + 1) + 500000).toString();
  }

  private updateDateToHumanForm(isoDate: string): string {
    const date = new Date(isoDate);
    return formatDistance(date, new Date(), { addSuffix: true })
  }  
}
