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

  override currentCopyCatVideo: YoutubeVideo;

  constructor(
    protected override navigationService: NavigationService,
    protected override transcriptRepo: TranscriptRepository,
    protected override textSplitUtility: TextSplitUtility,
    protected extractGenerationService: ExtractionContentService,
    protected extractContentRepo: ExtractContentRepository,
    private youtubeRepo: YoutubeDataRepository,
  ) {
    super(
      extractGenerationService,
      navigationService,
      extractContentRepo,
      transcriptRepo,
      textSplitUtility,
    );
  }

  getYoutubeVideosObserver(): Observable<YoutubeVideo[]> {
    return this.youtubeVideosSubject.asObservable();
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

  clearCurrentVideoPage() {
    this.extractContentRepo.clearCurrentPage();
  }

  getRandomNumber(): string {
    return Math.floor(Math.random() * (3000000 - 500000 + 1) + 500000).toString();
  }

  goToHomePage() {
    this.navigationService.navigateToCopyCat();
  }

  private updateDateToHumanForm(isoDate: string): string {
    const date = new Date(isoDate);
    return formatDistance(date, new Date(), { addSuffix: true })
  }  
}
