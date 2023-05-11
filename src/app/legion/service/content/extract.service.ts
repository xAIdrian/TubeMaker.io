import { Injectable } from '@angular/core';
import { ContentGenerationService } from './generation.service';
import { GptRepository } from '../../repository/gpt.repo';
import { ExtractContentRepository } from '../../repository/content/extractcontent.repo';

@Injectable({
  providedIn: 'root',
})
export class ContentExtractionService extends ContentGenerationService {

  constructor(
    gptRepo: GptRepository,
    private extractContentRepo: ExtractContentRepository
  ) {
    super(gptRepo);
  }

  optimizeNewScriptIndex(
    prompt: string, 
    sectionText: string, 
    sectionIndex: number
  ) {
    this.gptRepo.postOptimizeScriptSectionObservable(
      {
        prompt: prompt,
        current: sectionText
      },
      sectionIndex
    ).subscribe({
      next: (response) => {
        console.log("🚀 ~ file: contentgeneration.service.ts:161 ~ ContentGenerationService ~ response:", response)
        if (response.message !== 'success') {
          this.errorSubject.next(response.message);
        }
        this.scriptSectionSubject.next({
          scriptSection: response.result.script,
          position: response.result.position
        });
      },
      error: (error) => {
        this.errorSubject.next(error);
      }
    })
  }

}
