import { Injectable } from '@angular/core';
import { ContentRepository } from './content.repo';
import { Observable, concatMap, from, map, of } from 'rxjs';
import { YoutubeVideoPage } from '../../model/youtubevideopage.model';
import { EXTRACT_YOUTUBE_VIDEO_PAGE_COL } from '../firebase/firebase.constants';
import * as shortId  from 'shortid';
      
@Injectable({
  providedIn: 'root',
})
export class ExtractContentRepository extends ContentRepository {
  
  collectionPath: string = 'extract_pages';

  setWorkingPageObject(): Observable<YoutubeVideoPage> {
    const newDoc = { id: shortId.generate().toString() } as YoutubeVideoPage 
    console.log(EXTRACT_YOUTUBE_VIDEO_PAGE_COL)
    return from(this.firestoreRepository.createUsersDocument(
      'extract_pages',
      newDoc.id,
      newDoc
    ))
  }

  updateCopyCatScript(scriptArray: string[]) {
    this.firestoreRepository.updateUsersDocument(
      this.collectionPath,
      this.currentPage.id,
      { listScript: scriptArray })
      //todo this needs success observer
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
