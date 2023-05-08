import { Injectable } from '@angular/core';
import { ContentModel } from './common/content.model';

@Injectable({
  providedIn: 'root',
})
export class ExtractContentModel extends ContentModel {
  contentMap: Map<string, string>;
  private joinedScript: string = '';

  updateCopyCatScript(scriptArray: string[]) {
    this.joinedScript = scriptArray.join('\n\n');
  }
}
