import { Injectable } from '@angular/core';
import { ContentRepository } from './content.repo';
import { Observable, concatMap, from, map, of } from 'rxjs';
import { YoutubeVideoPage } from '../../model/youtubevideopage.model';
import { EXTRACT_YOUTUBE_VIDEO_PAGE_COL } from '../firebase/firebase.constants';
import shortId  from 'shortid';
      
@Injectable({
  providedIn: 'root',
})
export class ExtractContentRepository extends ContentRepository {
  
  collectionPath: string = EXTRACT_YOUTUBE_VIDEO_PAGE_COL;

  private joinedScript: string = '';

  setWorkingPageObject(): Observable<YoutubeVideoPage> {
    const newDoc = { id: shortId.generate().toString() } as YoutubeVideoPage 
    return from(this.firestoreRepository.createUsersDocument(
      this.collectionPath,
      newDoc.id,
      newDoc
    ))
  }

  updateCopyCatScript(scriptArray: string[]) {
    this.joinedScript = scriptArray.join('\n\n');
  }

  getCompleteScript(): Observable<string> {
    return this.firestoreRepository.getUsersDocument<YoutubeVideoPage>(
      this.collectionPath,
      this.currentPage.id
    ).pipe(
      map((doc) => {
        return doc.listScript.join('\n\n');
      })
    )
  }
}
