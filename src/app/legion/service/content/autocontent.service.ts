import { Injectable } from '@angular/core';
import { from, Observable, Subject, concatMap } from 'rxjs';

import { AutoContentRepository } from '../../repository/content/autocontent.repo';
import { GptRepository } from '../../repository/gpt.repo';
import { DurationSection, VideoDuration } from '../../model/autocreate/videoduration.model';
import { GenerateContentService } from './generation.service';
import { VideoMetadata } from '../../model/video/videometadata.model';
import { VideoNiche } from '../../model/autocreate/videoniche.model';

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
    console.log("🚀 ~ file: gpt.service.ts:192 ~ GptService ~ generateVideoContentWithAI ~ generateVideoContentWithAI:")
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
              niche,
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
              niche,
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
              niche,
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
    niche: VideoNiche,
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
      
      duration.sections.forEach((section: DurationSection) => {
        console.log("💵 ~ file: gpt.service.ts:271 ~ GptService ~ this.contentRepo.getCurrentVideoDuration ~ section:", section)
        this.getNewScriptSection(niche, section);
      });
    }
  }

  getNewScriptSection(
    niche: VideoNiche,
    section: DurationSection
  ) {
    //improve error being sent back here
    if (this.gptGeneratedSummary === '') {
      this.errorSubject.next('🤔 Something is not right. Please go back to the beginning and try again.');
      return;
    }
    let compiledPoints = '';
    let pointsCount = 0;

    from(section.points).pipe(
      concatMap((sectionPoint) => {
        console.log("💵 ~ file: gpt.service.ts:284 ~ GptService ~ concatMap ~ sectionPoint:", sectionPoint)
        
        return this.gptRepo.postNewScriptSectionObservable({
          summary: this.gptGeneratedSummary,
          style: niche.name,
          point: sectionPoint,
        });
      })
    ).subscribe((response) => {
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
