import { Injectable } from '@angular/core';
import { ContentRepository } from './content.repo';
import { Observable, catchError, concatMap, from, map, of, takeUntil, tap } from 'rxjs';
import { YoutubeVideoPage } from '../../model/youtubevideopage.model';
import { YoutubeVideo } from '../../model/video/youtubevideo.model';
      
@Injectable({
  providedIn: 'root',
})
export class ExtractContentRepository extends ContentRepository {
  
  collectionPath: string = 'extract_pages';

  setCurrentPageObject(newYoutubeVideo: YoutubeVideo): Observable<YoutubeVideoPage> {
    const newDoc: YoutubeVideoPage = {
      createdDate: new Date().toISOString(),
      createdFrom: 'extract',
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

  updateCopyCatScript(scriptArray: string[]) {
    this.firestoreRepository.updateUsersDocument(
      this.collectionPath,
      this.currentPage?.id ?? '',
      { listScript: scriptArray }
    ).catch((err) => console.log("❤️‍🔥 ~ file: extractcontent.repo.ts ~ line 40 ~ ExtractContentRepository ~ err", err))
  }

  getCompleteScript(): Observable<string> {
    return this.firestoreRepository.getUsersDocument<YoutubeVideoPage>(
      this.collectionPath,
      this.currentPage?.id ?? ''
    ).pipe(
      takeUntil(this.currentPageSubject),
      map((doc) => {
        return doc.listScript?.join('\n\n') ?? '';
      }),
      catchError((err) => {
        console.log("❤️‍🔥 ~ file: extractcontent.repo.ts ~ line 76 ~ ExtractContentRepository ~ catchError ~ err", err)
        throw new Error(err);
      })
    )
  }
}
