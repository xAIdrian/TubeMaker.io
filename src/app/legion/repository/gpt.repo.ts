import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root',
})
export class GptRepository {

  constructor(
    private http: HttpClient,
    private translate: TranslateService
  ) {}

  postNewTopicObservable(): Observable<{ message: string; result: any }> {
    const currLang = this.translate.currentLang;
    return this.http.get<{ message: string; result: any }>(
      `http://www.freeadmingptwebapp-384207.ew.r.appspot.com/api/openai/topic/${currLang}`
    );
  }

  getSummaryObservable(reqBody: {
    prompt: string;
  }): Observable<{ message: string; result: { id: string; summary: string } }> {
    const currLang = this.translate.currentLang;
    return this.http.post<{
      message: string;
      result: { id: string; summary: string };
    }>(`http://www.freeadmingptwebapp-384207.ew.r.appspot.com/api/openai/summary/${currLang}`, reqBody);
  }

  postNewTitleObservable(reqBody: {
    summary: string;
    style: string;
  }): Observable<{ message: string; result: { title: string } }> {
    const currLang = this.translate.currentLang;
    return this.http.post<{ message: string; result: { title: string } }>(
      `http://www.freeadmingptwebapp-384207.ew.r.appspot.com/api/openai/new/title/${currLang}`,
      reqBody
    );
  }

  postOptimizedTitleObservable(reqBody: {
    prompt: string;
    current: string;
  }): Observable<{ message: string; result: { title: string } }> {
    const currLang = this.translate.currentLang;
    return this.http.post<{ message: string; result: { title: string } }>(
      `http://www.freeadmingptwebapp-384207.ew.r.appspot.com/api/openai/improve/title/${currLang}`,
      reqBody
    );
  }

  postNewDescriptionObservable(reqBody: {
    summary: string;
    style: string;
  }): Observable<{ message: string; result: { description: string } }> {
    const currLang = this.translate.currentLang;
    return this.http.post<{ message: string; result: { description: string } }>(
      `http://www.freeadmingptwebapp-384207.ew.r.appspot.com/api/openai/new/description/${currLang}`,
      reqBody
    );
  }

  postOptimizedDescriptionObservable(reqBody: {
    prompt: string;
    current: string;
  }): Observable<{ message: string; result: { description: string } }> {
    const currLang = this.translate.currentLang;
    return this.http.post<{ message: string; result: { description: string } }>(
      `http://www.freeadmingptwebapp-384207.ew.r.appspot.com/api/openai/improve/description/${currLang}`,
      reqBody
    );
  }

  postNewScriptSectionObservable(reqBody: { summary: string, style: string, point: string}): Observable<{ message: string, result: { script: string } }> {
    const currLang = this.translate.currentLang;
    return this.http.post<{ message: string, result: { script: string } }>(
      `http://www.freeadmingptwebapp-384207.ew.r.appspot.com/api/openai/new/script/${currLang}`,
      reqBody
    );
  }

  postOptimizeScriptSectionObservable(
    reqBody: { 
      prompt: string,
      current: string
    },
    position: any
  ): Observable<{ 
      message: string,
      result: { 
        script: string ,
        position: any
      } 
    }> {
    const currLang = this.translate.currentLang;
    return this.http.post<{ message: string, result: { script: string } }>(
      `http://www.freeadmingptwebapp-384207.ew.r.appspot.com/api/openai/improve/script/${currLang}`,
      reqBody
    ).pipe(
        map((res) => {
          console.log("🚀 ~ file: gpt.repo.ts:102 ~ GptRepository ~ map ~ res:", res)
          return {
            message: res.message,
            result: {
              script: res.result.script,
              position: position
            }
          }
      })
    );
  }

  postNewTagsObservable(reqBody: {
    summary: string;
    style: string;
  }): Observable<{ message: string; result: { tags: string } }> {
    const currLang = this.translate.currentLang;
    return this.http.post<{ message: string; result: { tags: string } }>(
      `http://www.freeadmingptwebapp-384207.ew.r.appspot.com/api/openai/new/tags/${currLang}`,
      reqBody
    );
  }

  postOptimizedTagsObservable(reqBody: {
    prompt: string;
    current: string;
  }): Observable<{ message: string; result: { tags: string } }> {
    const currLang = this.translate.currentLang;
    return this.http.post<{ message: string; result: { tags: string } }>(
      `http://www.freeadmingptwebapp-384207.ew.r.appspot.com/api/openai/improve/tags/${currLang}`,
      reqBody
    );
  }
}
