import { Inject } from "@angular/core";
import { TranscriptRepository } from "../../repository/transcript.repo";
import { TextSplitUtility } from "../../helper/textsplit.utility";
import { NavigationService } from "../../service/navigation.service";
import { GenerateContentService } from "../../service/content/generation.service";
import { ContentRepository } from "../../repository/content/content.repo";
import { Observable, Subject, map, of, tap } from "rxjs";
import { YoutubeVideo } from "../../model/video/youtubevideo.model";

@Inject({
  providedIn: 'root',
})
export abstract class YoutubeService {

  errorSubject = new Subject<string>();
  kickBackErrorSubject = new Subject<string>();
  isTranscriptLoadingSubject = new Subject<boolean>();
  videoTranscriptSubject = new Subject<{ isLoading: boolean, section: string }[]>();

  constructor(
    protected generationService: GenerateContentService,
    protected navigationService: NavigationService,
    protected contentRepo: ContentRepository,
    protected transcriptRepo: TranscriptRepository,
    protected textSplitUtility: TextSplitUtility,
  ) { /** */ }

  abstract getNewVideoMetaData(): void;
  abstract updateTags(): void;
  abstract currentCopyCatVideo: YoutubeVideo;
  abstract goToHomePage(): void;

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

  updateNewScriptIndex(prompt: string, section: string, index: number) {
    this.generationService.optimizeNewScriptIndex(prompt, section, index);
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

  getVideoTranscriptObserver(): Observable<{ isLoading: boolean, section: string }[]> {
    return this.videoTranscriptSubject.asObservable();
  }

  getScriptSectionObserver(): Observable<{
    scriptSection: string
    sectionIndex: number
  }> {
    return this.generationService.getScriptSectionObserver().pipe(
      map((scriptSection) => {
        console.log("🚀 ~ file: extractdetails.service.ts:54 ~ ExtractDetailsService ~ map ~ scriptSection:", scriptSection)
        return {
          scriptSection: scriptSection.scriptSection.trim(),
          sectionIndex: scriptSection.position as number
        }
      })
    );
  }

  getNewVideoTranscript(currentCopyCatVideo?: { id: string, title: string }) {
    if (currentCopyCatVideo === null || currentCopyCatVideo === undefined) {
      // this.errorSubject.next('No videoId found. Sending placeholder for testing purposes.');
      return; // uncomment for prod
    } 

    // this.transcriptRepo.getTranscript('test').pipe(
    this.transcriptRepo.getTranscript(currentCopyCatVideo.id).pipe(
    ).subscribe({
      next: (response: { message: string, result: { translation: string }}) => {
        if (response.message !== 'success' || response.result.translation === '') {
          this.errorSubject.next(response.message);
          return;
        }
        if (response.result.translation === '') {
          this.errorSubject.next('No transcript found.');
          return;
        }

        const uiPreppedResponse: { isLoading: boolean, section: string }[] = [];
        const splitParagraphs = this.textSplitUtility.splitIntoParagraphs(response.result.translation)
        this.contentRepo.updateCopyCatScript(splitParagraphs)

        splitParagraphs.forEach((paragraph) => {
          uiPreppedResponse.push({ isLoading: false, section: paragraph.trim() });
        });

        this.videoTranscriptSubject.next(uiPreppedResponse);
        this.isTranscriptLoadingSubject.next(false);
      },
      error: (err) => {
        if (err = 'Error: Request failed with status code 505') {
          this.kickBackErrorSubject.next('Seems like the video you selected is not available for translation. Please select another video.');
        } else {
          console.log("🔥 ~ file: extractdetails.service.ts:122 ~ ExtractDetailsService ~ getVideoTranscript ~ err:", err)
          this.errorSubject.next(err);
        }
      },
    });
  }

  getVideoTranscript() {
    this.contentRepo.getCompleteScript().subscribe({
      next: (script) => {
        if (script === null || script === undefined || script.length === 0) {
          this.getNewVideoTranscript(this.currentCopyCatVideo);
          return;
        } else {
          const uiPreppedResponse: { isLoading: boolean, section: string }[] = [];
          const splitParagraphs = this.textSplitUtility.splitIntoParagraphs(script)

          splitParagraphs.forEach((paragraph) => {
            uiPreppedResponse.push({ isLoading: false, section: paragraph.trim() });
          });

          this.videoTranscriptSubject.next(uiPreppedResponse);
          this.isTranscriptLoadingSubject.next(false);
        }
      },
      error: (err) => {
        this.errorSubject.next(err);
      }
    });
  }

  updateScript(transcriptSections: { isLoading: boolean; section: string; }[]) {
    of(transcriptSections).pipe(
      map((sections) => {
        const script: string[] = [];
        sections.forEach((section) => {
          script.push(section.section.trim());
        });
        return script
      })
    ).subscribe((scriptArray: string[]) => {
      this.contentRepo.updateCopyCatScript(scriptArray)
    });
  }
}
