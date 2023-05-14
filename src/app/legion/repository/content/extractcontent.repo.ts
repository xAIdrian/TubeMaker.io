import { Injectable } from '@angular/core';
import { ContentRepository } from './content.repo';
import { Observable, catchError, concatMap, from, map, of, tap } from 'rxjs';
import { YoutubeVideoPage } from '../../model/youtubevideopage.model';
import { EXTRACT_YOUTUBE_VIDEO_PAGE_COL } from '../firebase/firebase.constants';
import { YoutubeVideo } from '../../model/video/youtubevideo.model';
      
@Injectable({
  providedIn: 'root',
})
export class ExtractContentRepository extends ContentRepository {
  
  collectionPath: string = 'extract_pages';

  setCurrentPageObject(newYoutubeVideo: YoutubeVideo): Observable<YoutubeVideoPage> {
    const newDoc: YoutubeVideoPage = {
      youtubeVideo: newYoutubeVideo
    } 
    return from(this.firestoreRepository.createUsersDocument<YoutubeVideoPage>(
      'extract_pages',
      newDoc
    )).pipe(
      tap((page) => this.currentPageSubject.next(page)),
      catchError((err) => {
        console.log("❤️‍🔥 ~ file: extractcontent.repo.ts ~ line 58 ~ ExtractContentRepository ~ catchError ~ err", err)
        throw new Error(err);
      })
    );
  }
}
