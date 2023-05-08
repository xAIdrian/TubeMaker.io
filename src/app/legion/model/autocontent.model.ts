import { Injectable } from '@angular/core';
import {
  VideoNiche,
} from './autocreate/videoniche.model';
import {
  getDefaultVideoDurations,
  VideoDuration,
} from './autocreate/videoduration.model';
import { combineLatest, concatMap, Observable, of } from 'rxjs';
import{ ContentModel } from './common/content.model';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root',
})
export class AutoContentModel extends ContentModel {

  constructor(
    override translate: TranslateService
  ) {
    super(translate)
  }
  
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

  scriptTotalNumberOfPoints: number = 0;
  scriptMap: Map<string, string> = new Map<string, string>([
    //controlName -> script section
    ['introduction', ''],
    ['mainContent', ''],
    ['caseStudies', ''],
    ['opinions', ''],
    ['questions', ''],
    ['actionables', ''],
    ['conclusion', ''],
  ]);

  contentMap: Map<string, string> = new Map<string, string>([
    ['title', ''],
    ['description', ''],
    ['tags', '']
  ]);

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
    this.scriptMap.set(controlName, script);
  }

  getCompleteScriptFromMap(): string {
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

  getTotalNumberOfPoints(): number {
    return this.scriptTotalNumberOfPoints;
  }

  getScriptForDownload(givenFileName: string): Observable<{ blob: Blob; filename: string }> {
    const completeScript = this.getCompleteScriptFromMap();
    if (completeScript !== '') {
      new Error(`Script not available ${completeScript}`)
    }
    const blob = new Blob([completeScript], { type: 'text/plain' });
    return of({
      blob: blob,
      filename: givenFileName.replace(' ', '_').replace(':', '').replace("'", '').replace('"', '') + '.txt',
    });
  }

  submitInputs(
    topic: string,
    videoStyle: VideoNiche,
    videoDuration: VideoDuration
  ) {
    this.scriptTotalNumberOfPoints = 0;

    this.currentTopic = topic
    super.currentNiche = videoStyle
    this.currentDuration = videoDuration

    this.currentDuration.sections.forEach((section) => {
      section.points.forEach((point) => {
        this.scriptTotalNumberOfPoints++;
      });
    });
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
    this.scriptMap.set('introduction', introduction);
    this.scriptMap.set('mainContent', mainContent);
    this.scriptMap.set('caseStudies', caseStudies);
    this.scriptMap.set('opinions', opinions);
    this.scriptMap.set('questions', questions);
    this.scriptMap.set('actionables', actionables);
    this.scriptMap.set('conclusion', conclusion);
  }
}
