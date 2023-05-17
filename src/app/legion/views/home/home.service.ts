import { Injectable } from '@angular/core';
import { AutoContentRepository } from '../../repository/content/autocontent.repo';
import { ExtractContentRepository } from '../../repository/content/extractcontent.repo';
import { YoutubeVideoPage } from '../../model/youtubevideopage.model';
import { Subject, combineLatest, switchMap } from 'rxjs';
import { NavigationService } from '../../service/navigation.service';
import { FireAuthRepository } from '../../repository/firebase/fireauth.repo';

@Injectable()
export class HomeService {
  private errorSubject = new Subject<string>();
  private completeVideoListSubject = new Subject<YoutubeVideoPage[]>();

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
    if (createdFrom === 'extract') {
      this.navigationService.navigateToExtractDetails(pageId);
    } else if (createdFrom === 'auto') {
      this.navigationService.navigateToAutoDetails(pageId);
    } else {
      this.errorSubject.next('Invalid createdFrom');
    }
  }

  goToCopyCat() {
    this.navigationService.navigateToCopyCat();
  }

  goToAutoCreate() {
    this.navigationService.navigateToBrandNew();
  }
}
