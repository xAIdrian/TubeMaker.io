import { Injectable } from '@angular/core';
import { AutoContentRepository } from '../../repository/content/autocontent.repo';
import { ExtractContentRepository } from '../../repository/content/extractcontent.repo';
import { YoutubeVideoPage } from '../../model/youtubevideopage.model';
import { Subject, combineLatest, switchMap } from 'rxjs';
import { NavigationService } from '../../service/navigation.service';
import { FireAuthRepository } from '../../repository/firebase/fireauth.repo';

@Injectable({
  providedIn: 'root',
})
export class HomeService {

  private errorSubject = new Subject<string>();
  private completeVideoListSubject = new Subject<YoutubeVideoPage[]>();

  constructor(
    private navigationService: NavigationService,
    private autoContentRepository: AutoContentRepository,
    private extractContentRepository: ExtractContentRepository,
    private authRepo: FireAuthRepository
  ) {}

  getErrorObserver() {
    return this.errorSubject.asObservable();
  }
  
  getCompleteVideoListObserver() {
    return this.completeVideoListSubject.asObservable();
  }

  getCompleteVideoList() {
    if (this.authRepo.sessionUser === undefined) {
      console.log("🔥 ~ file: home.service.ts:35 ~ HomeService ~ getCompleteVideoList ~ this.authRepo.sessionUser:", this.authRepo.sessionUser)
      this.authRepo.getUserAuthObservable().pipe(
        switchMap(() => combineLatest([
          this.autoContentRepository.getVideosList(),
          this.extractContentRepository.getVideosList()
        ]))
      ).subscribe({
        next: ([firstList, secondList]) => {
          console.log("🚀 ~ file: home.service.ts:47 ~ HomeService ~ getCompleteVideoList ~ firstList, secondList:", firstList, secondList)
          const joinedList = [...firstList, ...secondList];
          this.completeVideoListSubject.next(joinedList);
        },
        error: (error) => {
          console.log("🚀 ~ file: home.service.ts:45 ~ HomeService ~ getCompleteVideoList ~ error:", error)
          this.errorSubject.next(error);
        }
      });
    } else {
      console.log("🚀 ~ file: home.service.ts:35 ~ HomeService ~ getCompleteVideoList ~ this.authRepo.sessionUser:", this.authRepo.sessionUser)
      combineLatest([
        this.autoContentRepository.getVideosList(),
        this.extractContentRepository.getVideosList()
      ]).subscribe({
        next: ([firstList, secondList]) => {
          console.log("🚀 ~ file: home.service.ts:47 ~ HomeService ~ getCompleteVideoList ~ firstList, secondList:", firstList, secondList)
          const joinedList = [...firstList, ...secondList];
          this.completeVideoListSubject.next(joinedList);
        },
        error: (error) => {
          console.log("🚀 ~ file: home.service.ts:45 ~ HomeService ~ getCompleteVideoList ~ error:", error)
          this.errorSubject.next(error);
        }
      });
    }
  }

  private combinedPagesSubscription() {
    
  }

  videoPageSelected(pageId: string) {
    console.log("🚀 ~ file: home.service.ts:46 ~ HomeService ~ videoPageSelected ~ videoPageSelected:", pageId)
    this.navigationService.navigateToExtractDetails(pageId);
  }

  goToCopyCat() {
    this.navigationService.navigateToCopyCat();
  }

  goToAutoCreate() {
    this.navigationService.navigateToCreateVideo();
  }
}
