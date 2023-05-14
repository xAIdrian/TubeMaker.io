import { Inject } from "@angular/core";
import { TranscriptRepository } from "../../repository/transcript.repo";
import { TextSplitUtility } from "../../helper/textsplit.utility";
import { ExtractContentRepository } from "../../repository/content/extractcontent.repo";
import { YoutubeDataRepository } from "../../repository/youtubedata.repo";
import { ExtractionContentService } from "../../service/content/extractcontent.service";
import { NavigationService } from "../../service/navigation.service";
import { GenerateContentService } from "../../service/content/generation.service";
import { ContentRepository } from "../../repository/content/content.repo";
import { Observable, Subject, tap } from "rxjs";

@Inject({
  providedIn: 'root',
})
export abstract class YoutubeService {
  navigateHome() {
      throw new Error("Method not implemented.");
  }

  errorSubject = new Subject<string>();
  kickBackErrorSubject = new Subject<string>();
  isTranscriptLoadingSubject = new Subject<boolean>();

  constructor(
    protected generationService: GenerateContentService,
    protected navigationService: NavigationService,
    protected contentRepo: ContentRepository
  ) { /** */ }

  abstract getNewVideoMetaData(): void;
  abstract updateTags(): void;

  getErrorObserver(): Observable<string> {
    return this.errorSubject.asObservable();
  }

  getKickBackErrorObserver(): Observable<string> {
    return this.kickBackErrorSubject.asObservable();
  }

  getTranscriptIsLoadingObserver(): Observable<boolean> {
    return this.isTranscriptLoadingSubject.asObservable();
  }
  
  getTitleObserver() { 
    return this.generationService.getTitleObserver().pipe(
      tap((title) => {
        this.contentRepo.updateTitle(title)
      })
    ); 
  }

  getDescriptionObserver() { 
    return this.generationService.getDescriptionObserver().pipe(
      tap((description) => {
        this.contentRepo.updateDescription(description)
      })
    ); 
  }

  getTagsObserver() { 
    return this.generationService.getTagsObserver().pipe(
      tap((tags) => {
        this.contentRepo.updateTags(tags)
      })
    ); 
  }

  getCurrentPage(id: string) {
    return this.contentRepo.getCurrentPage(id)
  }

  getVideoMetaData() {
    this.contentRepo.getMetaData().subscribe({
      next: (response) => {
        this.generationService.titleSubject.next(response.title);
        this.generationService.descriptionSubject.next(response.description);
        this.generationService.tagsSubject.next(response.tags);
      },
      error: (err) => {
        this.errorSubject.next(err);  
      }
    });
  }

  updateTitle(prompt: string, current: string) { 
    this.generationService.optimizeTitle(prompt, current); 
  }

  updateDescription(prompt: string, current: string) { 
    this.generationService.optimizeDescription(prompt, current); 
  }

  submitSave(
    generatedAudioUrl: string,
    title: string, 
    description: string, 
    tags: string,
    script: string[]
  ) {
    this.contentRepo
      .submitCompleteInfos(generatedAudioUrl, title, description, tags, script)
      .subscribe({
        next: (response) => {
          this.kickBackErrorSubject.next('Save successful.');
        },
        error: (err) => {
          this.errorSubject.next(err);
        }
      })
  }
}
