import { Injectable } from '@angular/core';
import { GenerateContentService } from './generation.service';
import { GptRepository } from '../../repository/gpt.repo';

@Injectable({
  providedIn: 'root',
})
export class ExtractionContentService extends GenerateContentService {
  constructor(gptRepo: GptRepository) {
    super(gptRepo);
  }

  optimizeNewScriptIndex(
    prompt: string,
    sectionText: string,
    sectionIndex: number
  ) {
    this.gptRepo
      .postOptimizeScriptSectionObservable(
        {
          prompt: prompt,
          current: sectionText,
        },
        sectionIndex
      )
      .subscribe({
        next: (response) => {
          if (response.message !== 'success') {
            this.errorSubject.next(response.message);
          }
          this.scriptSectionSubject.next({
            scriptSection: response.result.script,
            position: response.result.position,
          });
        },
        error: (error) => {
          this.errorSubject.next(error);
        },
      });
  }
}
