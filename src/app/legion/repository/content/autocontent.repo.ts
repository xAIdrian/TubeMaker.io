import { Injectable } from '@angular/core';
import {
  VideoNiche,
} from '../../model/autocreate/videoniche.model';
import {
  getDefaultVideoDurations,
  VideoDuration,
} from '../../model/autocreate/videoduration.model';
import { catchError, combineLatest, concatMap, from, map, Observable, of, tap } from 'rxjs';
import{ ContentRepository } from './content.repo';
import { TranslateService } from '@ngx-translate/core';
import { YoutubeVideoPage } from '../../model/youtubevideopage.model';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AUTO_YOUTUBE_VIDEO_PAGE_COL } from '../firebase/firebase.constants';

@Injectable({
  providedIn: 'root',
})
export class AutoContentRepository extends ContentRepository {

  override collectionPath: string = 'auto_pages';

  scriptTotalNumberOfPoints: number = 0;
  
  currentTopic: string;
  currentDuration: VideoDuration = {
    name: 'please wait',
    header: '',
    description: '',
    sections: [
      {
        name: 'please wait',
        controlName: 'introduction',
        isLoading: false,
        isOptimizing: false,
        points: [],
      },
    ],
  };

  setCurrentPageObject(): Observable<YoutubeVideoPage> {
    const newDoc = { 
      structuredScript: new Map<string, string>([
        //controlName -> script section
        ['introduction', ''],
        ['mainContent', ''],
        ['caseStudies', ''],
        ['opinions', ''],
        ['questions', ''],
        ['actionables', ''],
        ['conclusion', ''],
      ]) 
    } as YoutubeVideoPage;
    return from(this.firestoreRepository.createUsersDocument<YoutubeVideoPage>(
      'auto_pages',
      newDoc
    )).pipe(
      tap((page) => this.currentPageSubject.next(page)),
      catchError((err) => {
        console.log("❤️‍🔥 ~ file: extractcontent.repo.ts ~ line 58 ~ ExtractContentRepository ~ catchError ~ err", err)
        throw new Error(err);
      })
    );
  }

  getInitVideoDurationObserver() {
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

  getDefaultVideoDurationsObserver(): Observable<VideoDuration[]> {
    return this.translate.getTranslation(this.translate.currentLang).pipe(
      concatMap((res) => {
        //perhaps this could be optimized to get from the 'res' insatead of parameter
        return of(getDefaultVideoDurations(this.translate));
      })
    )
  }

  getCurrentTopic(): string {
    return this.currentTopic;
  }

  getCurrentVideoDuration(): VideoDuration {
    return this.currentDuration;
  }

  updateScriptMap(controlName: string, script: string) {
    this.firestoreRepository.updateUsersDocument(
      this.collectionPath,
      this.currentPage?.id ?? '',
      {
        structuredScript: { controlName: script }
      }
    );
  }

  // getCompleteScript(): Observable<string> {
  //   let script = '';
  //   return this.firestoreRepository.getUsersDocument<YoutubeVideoPage>(
  //     this.collectionPath, 
  //     this.currentPage?.id ?? ''
  //   ).pipe(
  //     map((doc) => {
  //       const scriptMap = doc.structuredScript;
  //       if (scriptMap !== undefined && scriptMap !== null) {
  //         // get all the values of the ordered hashmap in the same order
  //         let valuesInOrder = Array.from(scriptMap.keys()).map(key => scriptMap.get(key));
  //         // add all values to main string
  //         valuesInOrder.map(value => {
  //           if (value !== undefined && value !== null && value !== '') {
  //             script += value + '\n\n';
  //           }
  //         });
  //         return script;
  //       } else {
  //         throw new Error('scriptMap is undefined or null');
  //       }
  //     })
  //   );
  // }

  getTotalNumberOfPoints(): number {
    return this.scriptTotalNumberOfPoints;
  }

  submitInputs(
    topic: string,
    videoStyle: VideoNiche,
    videoDuration: VideoDuration
  ): Observable<YoutubeVideoPage> {
    this.scriptTotalNumberOfPoints = 0;

    this.currentTopic = topic
    super.currentNiche = videoStyle
    this.currentDuration = videoDuration

    this.currentDuration.sections.forEach((section) => {
      section.points.forEach((point) => {
        this.scriptTotalNumberOfPoints++;
      });
    });

    return this.setCurrentPageObject();
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
        structuredScript: scriptMap
      }
    );
  }
}
