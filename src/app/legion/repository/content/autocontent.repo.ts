import { Injectable } from '@angular/core';
import { VideoNiche } from '../../model/autocreate/videoniche.model';
import {
  getDefaultVideoDurations,
  VideoDuration,
} from '../../model/autocreate/videoduration.model';
import {
  catchError,
  combineLatest,
  concatMap,
  from,
  map,
  Observable,
  of,
  tap,
} from 'rxjs';
import { ContentRepository } from './content.repo';
import { YoutubeVideoPage } from '../../model/youtubevideopage.model';
import { VideoMetadata } from '../../model/video/videometadata.model';
import { YoutubeVideo } from '../../model/video/youtubevideo.model';

@Injectable({
  providedIn: 'root',
})
export class AutoContentRepository extends ContentRepository {
  override collectionPath: string = 'auto_pages';

  structuredScript = new Map<string, string>([
    //controlName -> script section
    ['introduction', ''],
    ['mainContent', ''],
    ['caseStudies', ''],
    ['opinions', ''],
    ['questions', ''],
    ['actionables', ''],
    ['conclusion', ''],
  ]);

  setCurrentPageObject(
    videoTopic: string,
    videoNiche: VideoNiche,
    videoDuration: VideoDuration
  ): Observable<YoutubeVideoPage> {
    const newDoc: YoutubeVideoPage = {
      createdDate: new Date().toISOString(),
      createdFrom: 'auto',
      topic: videoTopic,
      niche: videoNiche,
      duration: videoDuration,
    };
    return from(
      this.firestoreRepository.createUsersDocument<YoutubeVideoPage>(
        'auto_pages',
        newDoc
      )
    ).pipe(
      tap((doc) => {
        if (doc.id === undefined) {
          throw new Error('🔥 doc.id is undefined');
        }
        this.firestoreRepository.updateUsersDocumentMap(
          'auto_pages',
          doc.id,
          this.structuredScript
        );
      }),
      tap((page) => this.currentPageSubject.next(page)),
      catchError((err) => {
        console.log(
          '❤️‍🔥 ~ file: extractcontent.repo.ts ~ line 58 ~ ExtractContentRepository ~ catchError ~ err',
          err
        );
        throw new Error(err);
      })
    );
  }

  getInitVideoDuration(): Observable<VideoDuration> {
    return combineLatest([
      //perhaps this could be optimized to get from the 'res'
      this.translate.get('video_duration.init_header'),
      this.translate.get('video_duration.init_description'),
    ]).pipe(
      concatMap(([header, description]) => {
        return of({
          name: '',
          header: header,
          description: description,
          sections: [],
        });
      })
    );
  }

  getDefaultInitVideoDurationObserver(): Observable<VideoDuration> {
    return this.translate.getTranslation(this.translate.currentLang).pipe(
      concatMap((res) => {
        //perhaps this could be optimized to get from the 'res' insatead of parameter
        return of({
          name: '',
          header: res.video_duration.init_header,
          description: res.video_duration.init_description,
          sections: [],
        });
      })
    );
  }

  getInitVideoNiche(): Observable<VideoNiche> {
    return combineLatest([
      this.translate.get('video_style.init_header'),
      this.translate.get('video_style.init_description'),
    ]).pipe(
      concatMap(([header, description]) => {
        return of({
          name: '',
          header: header,
          description: description,
          value: '',
        });
      })
    );
  }

  getDefaultInitVideoNicheObserver(): Observable<VideoNiche> {
    return this.translate.getTranslation(this.translate.currentLang).pipe(
      concatMap((res) => {
        //perhaps this could be optimized to get from the 'res' insatead of parameter
        return of({
          name: '',
          header: res.video_style.init_header,
          description: res.video_style.init_description,
          value: '',
        });
      })
    );
  }

  getDefaultVideoDurationsObserver(): Observable<VideoDuration[]> {
    return this.translate.getTranslation(this.translate.currentLang).pipe(
      concatMap((res) => {
        //perhaps this could be optimized to get from the 'res' insatead of parameter
        return of(getDefaultVideoDurations(this.translate));
      })
    );
  }

  updateScriptMap(controlName: string, script: string) {
    const property = `structuredScript.${controlName}`;
    this.firestoreRepository.updateUsersDocument(
      this.collectionPath,
      this.currentPage?.id ?? '',
      { [property]: script }
    );
  }

  updateCompleteMetaData(completedMetaData: VideoMetadata) {
    this.firestoreRepository.updateUsersDocument(
      this.collectionPath,
      this.currentPage?.id ?? '',
      { metadata: completedMetaData }
    );
  }

  getCompleteScript(): Observable<string> {
    let script = '';
    return this.firestoreRepository
      .getUsersDocument<YoutubeVideoPage>(
        this.collectionPath,
        this.currentPage?.id ?? ''
      )
      .pipe(
        map((doc) => {
          const scriptMap = doc.structuredScript;
          if (scriptMap !== undefined && scriptMap !== null) {
            Object.entries(scriptMap).forEach((value) => {
              this.structuredScript.set(value[0], value[1]);
            });
            // get all the values of the ordered hashmap in the same order
            this.structuredScript.forEach((value, key) => {
              if (value !== undefined && value !== null && value !== '') {
                script += value + '\n';
              }
            });
            console.log(script);
            return script;
          } else {
            throw new Error('scriptMap is undefined or null');
          }
        })
      );
  }

  submitScriptSections(
    introduction: string,
    mainContent: string,
    caseStudies: string = '',
    opinions: string = '',
    questions: string = '',
    actionables: string = '',
    conclusion: string = ''
  ) {
    const scriptMap = new Map<string, string>();
    scriptMap.set('introduction', introduction);
    scriptMap.set('mainContent', mainContent);
    scriptMap.set('caseStudies', caseStudies);
    scriptMap.set('opinions', opinions);
    scriptMap.set('questions', questions);
    scriptMap.set('actionables', actionables);
    scriptMap.set('conclusion', conclusion);

    this.firestoreRepository.updateUsersDocument(
      this.collectionPath,
      this.currentPage?.id ?? '',
      {
        structuredScript: scriptMap,
      }
    );
  }
}
