import { Injectable } from '@angular/core';
import {
  getDefaultVideoNiches,
  VideoNiche,
} from '../videoniche.model';
import {
  getDefaultVideoDurations,
  VideoDuration,
} from '../autocreate/videoduration.model';
import { combineLatest, concatMap, Observable, of, Subject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root',
})
export abstract class ContentModel {
  
  currentNiche: VideoNiche;

  abstract scriptTotalNumberOfPoints: number;
  abstract scriptMap: Map<string, string>; //controlName -> script section

  abstract contentMap: Map<string, string>;

  protected translate: TranslateService;

  constructor(
    private injTranslate: TranslateService
  ) { 
    this.translate = injTranslate
   }

  getInitVideoNiche(headerKey: string, descriptionKey: string): Observable<VideoNiche>{
    return combineLatest([
      this.translate.get(headerKey),
      this.translate.get(descriptionKey),
    ]).pipe(
      concatMap(([header, description]) => {
        return of({
          name: '',
          header: header,
          description: description
        });
      })
    )
  }

  updateScriptMap(controlName: string, script: string) {
     this.scriptMap.set(controlName, script);
  }

  getCompleteScript(): string {
    let script = '';
    // get all the values of the ordered hashmap in the same order
    let valuesInOrder = Array.from(this.scriptMap.keys()).map(key => this.scriptMap.get(key));
    // add all values to main string
    valuesInOrder.map(value => {
      if (value !== undefined && value !== null && value !== '') {
        script += value + '\n\n';
      }
    });
    return script;
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

  getTotalNumberOfPoints(): number {
    return this.scriptTotalNumberOfPoints;
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

  getScriptForDownload(givenFileName: string): Observable<{ blob: Blob; filename: string }> {
    const completeScript = this.getCompleteScript();
    if (completeScript !== '') {
      new Error(`Script not available ${completeScript}`)
    }
    const blob = new Blob([completeScript], { type: 'text/plain' });
    return of({
      blob: blob,
      filename: givenFileName.replace(' ', '_').replace(':', '').replace("'", '').replace('"', '') + '.txt',
    });
  }
}
