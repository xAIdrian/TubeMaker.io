import { Injectable } from '@angular/core';
import { GenerateContentService } from './generation.service';
import { GptRepository } from '../../repository/gpt.repo';
import { ExtractContentRepository } from '../../repository/content/extractcontent.repo';

@Injectable({
  providedIn: 'root',
})
export class ExtractionContentService extends GenerateContentService {

  constructor(
    gptRepo: GptRepository
  ) {
    super(gptRepo);
  }

}
