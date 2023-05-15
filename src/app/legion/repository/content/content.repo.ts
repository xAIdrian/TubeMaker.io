import { Injectable } from '@angular/core';
import {
  getDefaultVideoNiches,
  VideoNiche,
} from '../../model/autocreate/videoniche.model';
import { combineLatest, concatMap, filter, from, map, Observable, of, Subject, tap } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { FirestoreRepository } from '../firebase/firestore.repo';
import { YoutubeVideoPage } from '../../model/youtubevideopage.model';
import { VideoMetadata } from '../../model/video/videometadata.model';

@Injectable({
  providedIn: 'root',
})
export abstract class ContentRepository {
  
  protected currentPage?: YoutubeVideoPage;

  protected translate: TranslateService;
  protected firestoreRepository: FirestoreRepository;

  protected currentPageSubject = new Subject<YoutubeVideoPage>();
  getCurrentPageObserver(): Observable<YoutubeVideoPage> {
    return this.currentPageSubject.asObservable();
  }

  private generatedAudioUrl = new Subject<string>();
  getGeneratedAudioUrlObserver(): Observable<string> {
    return this.generatedAudioUrl.asObservable();
  }

  abstract collectionPath: string;
  abstract getCompleteScript(): Observable<string>;

  constructor(
    initTranslate: TranslateService,
    initFirestoreRepository: FirestoreRepository,
  ) { 
    this.translate = initTranslate;
    this.firestoreRepository = initFirestoreRepository;

    this.getCurrentPageObserver().subscribe({
      next: (youtubeVideoPage) => { 
        if (youtubeVideoPage.id !== undefined && youtubeVideoPage.id !== '') {
          console.log("~ empty object created successfully", youtubeVideoPage)
          this.currentPage = youtubeVideoPage; 
        } else {
          console.log("~ empty object created unsuccessfully ID MISSING", youtubeVideoPage)
        }
      },
      error: (err) => { 
        console.log("~ empty object error", err) 
      }
    })
  }

  getDefaultVideoNichesObserver(): Observable<VideoNiche[]> {
    return this.translate.getTranslation(this.translate.currentLang).pipe(
      concatMap((res) => {
        return of(getDefaultVideoNiches(this.translate));
      })
    )
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

  getCurrentPage(id: string): Observable<YoutubeVideoPage> {
    if (id === '' && this.currentPage !== undefined) {
      return of(this.currentPage)
    } else {
      return this.firestoreRepository.getUsersDocument<YoutubeVideoPage>(
        this.collectionPath,
        id
      ).pipe(
        tap((youtubeVideoPage) => {
          this.currentPageSubject.next(youtubeVideoPage);
        })
      )
    }
  }

  getMetaData(): Observable<VideoMetadata> {
    return this.firestoreRepository.getUsersDocument<YoutubeVideoPage>(
      this.collectionPath,
      this.currentPage?.id ?? ''
    ).pipe(
      //filiering for undefined
      filter((data) => !!data),
      map((document) => {
        return document.metadata as VideoMetadata;
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

  getGeneratedAudioUrl(parentVideoId: string) {
    this.firestoreRepository.getUsersDocument<YoutubeVideoPage>(
      this.collectionPath,
      parentVideoId
    ).pipe(
      //filiering for undefined
      filter((data) => !!data),
      map((document) => {
        return document.generatedAudioUrl;
      }
    ))
  }

  submitCompleteInfos(
    generatedAudioUrl: string,
    title: string, 
    description: string, 
    tags: string,
    script: string[]
  ): Observable<boolean> {
    return from(this.firestoreRepository.updateUsersDocument(
      this.collectionPath,
      this.currentPage?.id ?? '',
      {
        generatedAudioUrl: generatedAudioUrl,
        metadata: {
          title: title,
          description: description,
          tags: tags
        }, 
        listScript: script
      }
    ))
  }

  clearCurrentPage() {
    this.currentPage = undefined;
  }

  getVideosList(): Observable<YoutubeVideoPage[]> {
    return this.firestoreRepository
      .getUsersCollection<YoutubeVideoPage>(this.collectionPath)
      .pipe(
        map((documents) => {
          return documents.map((document) => {
            return document as YoutubeVideoPage;
          })
        }
      )
    )
  }

  updateTitle(newTitle: string) {
    this.firestoreRepository.updateUsersDocument(
      this.collectionPath,
      this.currentPage?.id ?? '',
      { "metadata.title": newTitle }
    ).catch((err) => console.log("❤️‍🔥 ~ file: extractcontent.repo.ts ~ line 48 ~ ExtractContentRepository ~ err", err))
  }

  updateDescription(newDescription: string) {
    this.firestoreRepository.updateUsersDocument(
      this.collectionPath,
      this.currentPage?.id ?? '',
      { "metadata.description": newDescription }
    ).catch((err) => console.log("❤️‍🔥 ~ file: extractcontent.repo.ts ~ line 56 ~ ExtractContentRepository ~ err", err))
  }

  updateTags(newTags: string[]) {
    this.firestoreRepository.updateUsersDocument(
      this.collectionPath,
      this.currentPage?.id ?? '',
      { "metadata.tags": newTags }
    ).catch((err) => console.log("❤️‍🔥 ~ file: extractcontent.repo.ts ~ line 64 ~ ExtractContentRepository ~ err", err))
  }
}
