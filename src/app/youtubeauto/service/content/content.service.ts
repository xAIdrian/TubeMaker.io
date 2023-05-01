import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Media } from '../../model/media/media.model';
import { ListVideo } from '../../model/media/video/listvideo.model';
import {
  getDefaultVideoStyles,
  VideoStyle,
} from '../../model/create/videostyle.model';
import {
  getDefaultVideoDurations,
  VideoDuration,
} from '../../model/create/videoduration.model';
import { Observable, of, Subject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root',
})
export class ContentService {
  
  mediaSubjectObserver = new Subject<Media>();

  private youtubeVideoStyles: VideoStyle[];
  private youtubeVideoDurations: VideoDuration[];

  private currentTopic: string;
  private currentStyle: VideoStyle;
  private currentDuration: VideoDuration = {
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
  private currentMonetization: string;
  private currentProductName: string;
  private currentProductDescription: string;
  private currentLinks: string[];

  private scriptTotalNumberOfPoints: number = 0;
  private scriptMap: Map<string, string> = new Map<string, string>([
    //controlName -> script section
    ['introduction', ''],
    ['mainContent', ''],
    ['caseStudies', ''],
    ['opinions', ''],
    ['questions', ''],
    ['actionables', ''],
    ['conclusion', ''],
  ]);

  private contentMap: Map<string, string> = new Map<string, string>([
    ['title', ''],
    ['description', ''],
    ['tags', '']
  ]);

  constructor(
    private translate: TranslateService
  ) {
    this.youtubeVideoStyles = getDefaultVideoStyles(this.translate);
    this.youtubeVideoDurations = getDefaultVideoDurations(this.translate);
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

  getVideoOptionsObserver(): Observable<VideoStyle[]> {
    return of(this.youtubeVideoStyles);
  }

  getDurationOptionsObserver(): Observable<VideoDuration[]> {
    return of(this.youtubeVideoDurations);
  }

  getMediaObserver(): Observable<Media> {
    return this.mediaSubjectObserver.asObservable();
  }

  getCurrentVideoDuration(): VideoDuration {
    return this.currentDuration;
  }

  getCurrentVideoStyle(): VideoStyle {
    return this.currentStyle;
  }

  getCurrentTopic(): string {
    return this.currentTopic;
  }

  getCurrentMonetization(): string {
    return this.currentMonetization;
  }

  getCurrentProductName(): string {
    return this.currentProductName;
  }

  getCurrentProductDescription(): string {
    return this.currentProductDescription;
  }

  getCurrentLinks(): string[] {
    return this.currentLinks;
  }

  submitInputs(
    topic: string,
    videoStyle: VideoStyle,
    videoDuration: VideoDuration
  ) {
    (this.currentTopic = topic),
      (this.currentStyle = videoStyle),
      (this.currentDuration = videoDuration)

    this.currentDuration.sections.forEach((section) => {
      section.points.forEach((point) => {
        this.scriptTotalNumberOfPoints++;
      });
    });
  }

  submitInfos(title: string, description: string, tags: string) {
    this.contentMap.set('title', title);
    this.contentMap.set('description', description);
    this.contentMap.set('tags', tags);
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

  getScriptForDownload(): Observable<{ blob: Blob; filename: string }> {
    const completeScript = this.getCompleteScript();
    if (completeScript !== '') {
      new Error(`Script not available ${completeScript}`)
    }
    const blob = new Blob([completeScript], { type: 'text/plain' });
    return of({
      blob: blob,
      filename:
        this.getCurrentTopic()
          .replace(' ', '_')
          .replace(':', '')
          .replace("'", '')
          .replace('"', '') + '.txt',
    });
  }
}
