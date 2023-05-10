import { Injectable } from '@angular/core';
import {
  getDefaultVideoNiches,
  VideoNiche,
} from '../autocreate/videoniche.model';
import { combineLatest, concatMap, Observable, of, Subject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root',
})
export abstract class ContentModel {
  
  currentNiche: VideoNiche;

  abstract contentMap: Map<string, string>;

  protected translate: TranslateService;

  constructor(
    private initTranslate: TranslateService
  ) { 
    this.translate = initTranslate
  }

  abstract getCompleteScript(): string;
  abstract getScriptForDownload(givenFileName: string): Observable<{ blob: Blob; filename: string }>;

  getInitVideoNiche(headerKey: string, descriptionKey: string): Observable<VideoNiche>{
    return combineLatest([
      this.translate.get(headerKey),
      this.translate.get(descriptionKey),
    ]).pipe(
      concatMap(([header, description]) => {
        return of({
          name: '',
          header: header,
          description: description,
          value: '',
        });
      })
    )
  }

  getTitle(): string {
    return this.contentMap.get('title') ?? '';
  }
  getDescription(): string {
    return this.contentMap.get('description') ?? '';
  }
  getTags(): string {
    return this.contentMap.get('tags') ?? '';
  }

  getDefaultVideoNichesObserver(): Observable<VideoNiche[]> {
    return this.translate.getTranslation(this.translate.currentLang).pipe(
      concatMap((res) => {
        return of(getDefaultVideoNiches(this.translate));
      })
    )
  }

  getCurrentVideoNiche(): VideoNiche {
    return this.currentNiche;
  }

  submitInfos(title: string, description: string, tags: string) {
    this.contentMap.set('title', title);
    this.contentMap.set('description', description);
    this.contentMap.set('tags', tags);
  }
}
