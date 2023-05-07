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

@Injectable({
  providedIn: 'root',
})
export class AutoContentModel extends ContentModel {
  
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

  getInitVideoDuration() {
    return combineLatest([
      super.translate.get('video_duration.init_header'),
      super.translate.get('video_duration.init_description'),
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
    return super.translate.getTranslation(super.translate.currentLang).pipe(
      concatMap((res) => {
        return of(getDefaultVideoDurations(super.translate));
      })
    )
  }

  getCurrentTopic(): string {
    return this.currentTopic;
  }

  getCurrentVideoDuration(): VideoDuration {
    return this.currentDuration;
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
