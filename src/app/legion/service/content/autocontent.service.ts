import { Injectable } from '@angular/core';
import { from, Observable, Subject, concatMap, filter, switchMap } from 'rxjs';
import { AutoContentRepository } from '../../repository/content/autocontent.repo';
import { GptRepository } from '../../repository/gpt.repo';
import { DurationSection, VideoDuration } from '../../model/autocreate/videoduration.model';
import { GenerateContentService } from './generation.service';
import { VideoMetadata } from '../../model/video/videometadata.model';
import { VideoNiche } from '../../model/autocreate/videoniche.model';
import { match } from 'assert';

@Injectable({
  providedIn: 'root',
})
export class AutoContentService extends GenerateContentService {

  private gptGeneratedSummary: string = ''
  private totalScriptPoints: number = 0;

  //state observables
  private contentProgressSubject = new Subject<number>();
  private scriptProgressSubject = new Subject<{
    increment: number,
    label: string
  }>();
  private completeDetailsSubject = new Subject<{
    meta: VideoMetadata,
    // script: GptGeneratedScriptData
  }>();

  constructor(
    gptRepo: GptRepository,
    private contentRepo: AutoContentRepository
  ) {
    super(gptRepo);
  }

  getContentProgressObserver(): Observable<number> { return this.contentProgressSubject.asObservable();  }
  getScriptProgressObserver(): Observable<{
    increment: number,
    label: string
  }> { return this.scriptProgressSubject.asObservable();  }
  getCompleteResultsObserver(): Observable<{
    meta: VideoMetadata
  }> { return this.completeDetailsSubject.asObservable();  }

  updateNewTopic() {
    console.log("🚀 ~ file: gpt.service.ts:63 ~ GptService ~ updateNewTopic ~ updateNewTopic:")
    this.gptRepo.postNewTopicObservable().subscribe((response) => {
      console.log("🚀 ~ file: gpt.service.ts:65 ~ GptService ~ this.gptRepo.postNewTopicObservable ~ response:", response)
      if (response.message !== 'success') {
        this.errorSubject.next(response.message);
        return;
      }
      this.topicSubject.next(response.result.topic);
    });
  }

  setTotalScriptPoints(duration: VideoDuration) {
    duration.sections.forEach((section) => {
      section.points.forEach((point) => {
        this.totalScriptPoints++;
      });
    });
  }

  resetTotalScriptPoints() {
    this.totalScriptPoints = 0;
  }

  generateVideoContentWithAI(
    topic: string,
    niche: VideoNiche,
    duration: VideoDuration
  ) {
    if (topic === undefined || niche === undefined || duration === undefined) { 
      console.log("🔥 ~ file: gpt.service.ts:197 ~ GptService ~ generateVideoContentWithAI ~ this.contentRepo.getCurrentVideoNiche():", 'missing input')
      this.errorSubject.next('🤔 Something is not right. Please go back to the beginning and try again.');
      return;
    }

    let compeleteMetaData: VideoMetadata = {
      summary: '',
      title: '',
      description: '',
      tags: [],
    };

    this.gptRepo.getSummaryObservable({
      prompt: topic
    }).subscribe((response) => {
      if (response.message !== 'success') {
        this.errorSubject.next(response.message);
        return;
      } else {
        const requestSummary = response.result.summary;
        console.log("🚀 ~ file: autocontent.service.ts:97 ~ AutoContentService ~ requestSummary:", requestSummary)
        const requestKeyPoints = response.result.key_points;
        console.log("🚀 ~ file: autocontent.service.ts:99 ~ AutoContentService ~ requestKeyPoints:", requestKeyPoints)
        const requestScriptVoice = response.result.script_voice;
        console.log("🚀 ~ file: autocontent.service.ts:101 ~ AutoContentService ~ requestScriptVoice:", requestScriptVoice)

        compeleteMetaData.summary = requestSummary;
        this.gptGeneratedSummary = requestSummary;
        this.contentProgressSubject.next(25);
        
        this.gptRepo.postNewTitleObservable({
          summary: requestSummary,
          style: niche.name
        }).subscribe((response) => {
          if (response.message !== 'success') {
            this.errorSubject.next(response.message);
            return;
          } else {
            compeleteMetaData.title = response.result.title;
            this.contentProgressSubject.next(25);
            this.checkForCompleteResultsCompletion(
              compeleteMetaData,
              requestKeyPoints,
              requestScriptVoice,
              duration
            );
          }
        });

        this.gptRepo.postNewDescriptionObservable({
          summary: requestSummary,
          style: niche.name
        }).subscribe((response) => {
          if (response.message !== 'success') {
            this.errorSubject.next(response.message);
            return;
          } else {
            compeleteMetaData.description = response.result.description;
            this.contentProgressSubject.next(25);
            this.checkForCompleteResultsCompletion(
              compeleteMetaData,
              requestKeyPoints,
              requestScriptVoice,
              duration
            );
          }
        });

        this.gptRepo.postNewTagsObservable({
          summary: requestSummary,
          style: niche.name
        }).subscribe((response) => {
          if (response.message !== 'success') {
            this.errorSubject.next(response.message);
            return;
          } else {
            compeleteMetaData.tags = response.result.tags.split(',');
            this.contentProgressSubject.next(25);
            this.checkForCompleteResultsCompletion(
              compeleteMetaData,
              requestKeyPoints,
              requestScriptVoice,
              duration
            );
          }
        });
      }
    });
  }

  /**
   * With this function we check if the complete results are ready to be displayed meaning every field has a non-null and non-empty value
   * When we are ready to display the results we call .next() on the completeResultsObserverSubject, otherwise take no action
   * @returns 
   */
  checkForCompleteResultsCompletion(
    metadata: VideoMetadata,
    key_points: string,
    script_voice: string,
    duration: VideoDuration
  ) {
    if (
      metadata.title !== '' 
      && metadata.description !== ''
      && metadata.tags.length > 0
    ) {
      this.contentRepo.updateCompleteMetaData(metadata);
      this.completeDetailsSubject.next({ meta: metadata});
      console.log("🚀 ~ file: gpt.service.ts:266 ~ GptService ~ completedMetaData:", metadata)

      this.gptRepo.postPointsObservable({
        key_points: key_points,
        script_points: this.getNestedSectionPointsAsList(duration).join(','),
      }).subscribe((response) => {
        if (response.message !== 'success') {
          this.errorSubject.next(response.message);
          return;
        } else {
          
          duration.sections.forEach((section: DurationSection) => {
            console.log("💵 ~ file: gpt.service.ts:271 ~ GptService ~ this.contentRepo.getCurrentVideoDuration ~ section:", section)
            this.getNewScriptSection(
              metadata.title, 
              script_voice,
              section,
              response.result.point_key_matching
            );
          });
        }
      });
    }
  }

  getNewScriptSection(
    title: string,
    script_voice: string,
    section: DurationSection,
    matched_points: string
  ) {
    console.log("🚀 ~ file: autocontent.service.ts:213 ~ AutoContentService ~ matched_points:", matched_points)
    console.log("🚀 ~ file: autocontent.service.ts:213 ~ AutoContentService ~ section:", section)
    console.log("🚀 ~ file: autocontent.service.ts:213 ~ AutoContentService ~ script_voice:", script_voice)
    console.log("🚀 ~ file: autocontent.service.ts:213 ~ AutoContentService ~ title:", title)
    
    const matchedPointsObj = JSON.parse(matched_points);
    let compiledPoints = '';
    let pointsCount = 0;

    // here we are filtering the matched points to only include the points that are in the current section
    from(Object.entries(matchedPointsObj)).pipe(
      filter(([sectionPoint, key_point]) => {
        return section.points.includes(sectionPoint);
      }),
      switchMap(([sectionPoint, keyPoint]) => {
        console.log("💵 ~ file: gpt.service.ts:284 ~ GptService ~ concatMap ~ sectionPoint:", sectionPoint)
        
        let keyPointStr = keyPoint as string;
        return this.gptRepo.postNewScriptSectionObservable({
          title: title,
          voice: script_voice,
          point: sectionPoint,
          key: keyPointStr,
        });
      })
    ).subscribe((response: { message: string; result: { script: string; }; }) => {
      console.log("💵 ~ file: gpt.service.ts:293 ~ GptService ~ ).subscribe ~ response:", response)
      if (response.message !== 'success') {
        this.errorSubject.next(response.message);
        return;
      }
      pointsCount++;
      compiledPoints += '\n' + response.result.script;

      //here we are managing the loading state of the view and the final nav point
      const progressItem = {
        increment: 100 / this.getTotalScriptPoints(),
        label: this.generateLoadingMessage(),
      }
      this.scriptProgressSubject.next(progressItem);

      if (pointsCount === section.points.length) { 
        this.contentRepo.updateScriptMap(section.controlName, compiledPoints.trim()); 
        // emit just the view value of the section
        this.scriptSectionSubject.next({
          scriptSection: compiledPoints.trim(),
          position: section.controlName
        });
      }
    });
  }

  getNestedSectionPointsAsList(duratiom: VideoDuration): string[] {
    const pointsList: string[] = [];
    duratiom.sections.forEach((section) => {
      section.points.forEach((point) => {
        pointsList.push(point);
      });
    });
    return pointsList;
  }

  getTotalScriptPoints(): number {
    return this.totalScriptPoints;
  }

  generateLoadingMessage(): string {
    const messages = [
      'Traitement des données neuronales...',
      'Optimisation des modèles d\'apprentissage profond...',
      'Formation de l\'intelligence artificielle...',
      'Analyse des ensembles de données...',
      'Génération d\'échantillons synthétiques...',
      'Amélioration des algorithmes d\'apprentissage automatique...',
      'Simulation de réseaux neuronaux...',
      'Création d\'agents intelligents...',
      'Modélisation de données avec des réseaux neuronaux artificiels...',
      'Conception de systèmes de traitement du langage naturel...',
      'Extraction des caractéristiques des images...',
      'Création de systèmes de décision intelligents...'
    ];
    const index = Math.floor(Math.random() * messages.length);
    return messages[index];
  }
  
}
