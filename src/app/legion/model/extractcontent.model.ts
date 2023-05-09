import { Injectable } from '@angular/core';
import { ContentModel } from './common/content.model';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ExtractContentModel extends ContentModel {

  contentMap: Map<string, string>;
  private joinedScript: string = '';

  updateCopyCatScript(scriptArray: string[]) {
    this.joinedScript = scriptArray.join('\n\n');
  }

  getCompleteScript() {
    return this.joinedScript;
  }

  getScriptForDownload(givenFileName: string): Observable<{ blob: Blob; filename: string }> {
    const completeScript = this.getCompleteScript();
    if (completeScript !== '') {
      new Error(`Script not available ${completeScript}`)
    }
    const blob = new Blob([completeScript], { type: 'text/plain' });
    return of({
      blob: blob,
      filename: givenFileName.replace(' ', '_').replace(':', '').replace("'", '').replace('"', '') + '.txt',
    });
  }
}
