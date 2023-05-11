import { Injectable } from '@angular/core';
import {
  getDefaultVideoNiches,
  VideoNiche,
} from '../../model/autocreate/videoniche.model';
import { combineLatest, concatMap, map, Observable, of, Subject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { FirestoreRepository } from '../firebase/firestore.repo';
import { YoutubeVideoPage } from '../../model/youtubevideopage.model';
import { VideoMetadata } from '../../model/video/videometadata.model';

@Injectable({
  providedIn: 'root',
})
export abstract class ContentRepository {
  
  protected currentPage: YoutubeVideoPage;
  protected currentNiche: VideoNiche;

  protected translate: TranslateService;
  protected firestoreRepository: FirestoreRepository;

  abstract collectionPath: string;

  constructor(
    initTranslate: TranslateService,
    initFirestoreRepository: FirestoreRepository,
  ) { 
    this.translate = initTranslate;
    this.firestoreRepository = initFirestoreRepository;

    this.setWorkingPageObject().subscribe({
      next: (youtubeVideoPage) => { 
        console.log("❤️‍🔥 ~ empty object created successfully")
        this.currentPage = youtubeVideoPage; 
      },
      error: (err) => { 
        console.log("❤️‍🔥 ~ empty object created successfully", err) 
      }
    })
  }

  abstract setWorkingPageObject(): Observable<YoutubeVideoPage>;
  abstract getCompleteScript(): Observable<string>;

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

  getMetaData(): Observable<VideoMetadata> {
    return this.firestoreRepository.getUsersDocument<YoutubeVideoPage>(
      this.collectionPath,
      this.currentPage.id
    ).pipe(
      map((document) => {
        return document.metadata;
      })
    )
  }

  getScriptForDownload(givenFileName: string): Observable<{ blob: Blob; filename: string }> {
    return this.getCompleteScript().pipe(
      concatMap((completeScript) => {
        if (completeScript !== '') {
          throw new Error(`Script not available ${completeScript}`)
        }
        const blob = new Blob([completeScript], { type: 'text/plain' });
        return of({
          blob: blob,
          filename: givenFileName.replace(' ', '_').replace(':', '').replace("'", '').replace('"', '') + '.txt',
        });
      })
    );
  }

  submitInfos(title: string, description: string, tags: string) {
    return this.firestoreRepository.updateUsersDocument(
      this.collectionPath,
      this.currentPage.id,
      {
        title: title,
        description: description,
        tags: tags,
      }
    )
  }
}
