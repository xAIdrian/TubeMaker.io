import { Injectable } from '@angular/core';
import { AutoContentRepository } from '../../repository/content/autocontent.repo';
import { ExtractContentRepository } from '../../repository/content/extractcontent.repo';
import { YoutubeVideoPage } from '../../model/youtubevideopage.model';
import { Observable, Subject, combineLatest, of, switchMap } from 'rxjs';
import { NavigationService } from '../../service/navigation.service';
import { FireAuthRepository } from '../../repository/firebase/fireauth.repo';
import { YoutubeVideo } from '../../model/video/youtubevideo.model';

@Injectable()
export class HomeService {
  private errorSubject = new Subject<string>();
  private completeVideoListSubject = new Subject<YoutubeVideoPage[]>();

  pageId: string;

  constructor(
    private navigationService: NavigationService,
    private autoContentRepository: AutoContentRepository,
    private extractContentRepository: ExtractContentRepository
  ) {}

  getErrorObserver() {
    return this.errorSubject.asObservable();
  }

  getCompleteVideoListObserver() {
    return this.completeVideoListSubject.asObservable();
  }

  getCompleteVideoList() {
    combineLatest([
      this.autoContentRepository.getVideosList(),
      this.extractContentRepository.getVideosList(),
    ]).subscribe({
      next: ([firstList, secondList]) => {
        const joinedList = [...firstList, ...secondList];
        this.completeVideoListSubject.next(joinedList);
      },
      error: (error) => {
        console.log(
          '🔥 ~ file: home.service.ts:45 ~ HomeService ~ getCompleteVideoList ~ error:',
          error
        );
        this.errorSubject.next(error);
      },
    });
  }

  videoPageSelected(pageId: string, createdFrom: string) {
    if (!pageId || pageId === '' || !createdFrom || createdFrom === '') {
      this.errorSubject.next('Invalid pageId or createdFrom');
      return;
    }
    this.pageId = pageId;
    if (createdFrom === 'extract') {
      this.navigationService.navigateToExtractDetails(pageId);
    } else if (createdFrom === 'auto') {
      this.navigationService.navigateToAutoDetails(pageId);
    } else {
      this.errorSubject.next('Invalid createdFrom');
    }
  }

  deleteVideo(video: YoutubeVideo): Observable<boolean> {
    if (!video || video.id === '') {
      this.errorSubject.next('Invalid video');
      return of(false);
    }

    let deleteObs: Observable<boolean>;
    if (video.createdFrom === 'extract') {
      deleteObs = this.extractContentRepository.deleteVideo(video);
    } else {
      deleteObs = this.autoContentRepository.deleteVideo(video);
    }

    deleteObs.subscribe((response) => {
      if (response) {
        this.getCompleteVideoList();
      } else {
        this.errorSubject.next('Delete failed');
      }
    });

    return deleteObs;
  }

  goToCopyCat() {
    this.navigationService.navigateToCopyCat();
  }

  goToAutoCreate() {
    this.navigationService.navigateToBrandNew();
  }
}
