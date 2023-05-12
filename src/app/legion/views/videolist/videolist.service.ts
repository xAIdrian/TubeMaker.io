import { Injectable } from '@angular/core';
import { AutoContentRepository } from '../../repository/content/autocontent.repo';
import { ExtractContentRepository } from '../../repository/content/extractcontent.repo';
import { YoutubeVideoPage } from '../../model/youtubevideopage.model';
import { Subject, combineLatest } from 'rxjs';
import { NavigationService } from '../../service/navigation.service';

@Injectable({
  providedIn: 'root',
})
export class VideoListService {

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
      this.extractContentRepository.getVideosList()
    ]).subscribe({
      next: ([firstList, secondList]) => {
        const joinedList = [...firstList, ...secondList];
        this.completeVideoListSubject.next(joinedList);
      },
      error: (error) => {}
    });
  }
}
