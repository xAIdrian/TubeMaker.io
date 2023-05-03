import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
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
      `http://localhost:3000/api/openai/topic/${currLang}`
    );
  }

  getSummaryObservable(reqBody: {
    prompt: string;
  }): Observable<{ message: string; result: { id: string; summary: string } }> {
    const currLang = this.translate.currentLang;
    return this.http.post<{
      message: string;
      result: { id: string; summary: string };
    }>(`http://localhost:3000/api/openai/summary/${currLang}`, reqBody);
  }

  postNewTitleObservable(reqBody: {
    summary: string;
    style: string;
  }): Observable<{ message: string; result: { title: string } }> {
    const currLang = this.translate.currentLang;
    return this.http.post<{ message: string; result: { title: string } }>(
      `http://localhost:3000/api/openai/new/title/${currLang}`,
      reqBody
    );
  }

  postOptimizedTitleObservable(reqBody: {
    current: string;
  }): Observable<{ message: string; result: { title: string } }> {
    const currLang = this.translate.currentLang;
    return this.http.post<{ message: string; result: { title: string } }>(
      `http://localhost:3000/api/openai/improve/title/${currLang}`,
      reqBody
    );
  }

  postNewDescriptionObservable(reqBody: {
    summary: string;
    style: string;
  }): Observable<{ message: string; result: { description: string } }> {
    const currLang = this.translate.currentLang;
    return this.http.post<{ message: string; result: { description: string } }>(
      `http://localhost:3000/api/openai/new/description/${currLang}`,
      reqBody
    );
  }

  postOptimizedDescriptionObservable(reqBody: {
    current: string;
  }): Observable<{ message: string; result: { description: string } }> {
    const currLang = this.translate.currentLang;
    return this.http.post<{ message: string; result: { description: string } }>(
      `http://localhost:3000/api/openai/improve/description/${currLang}`,
      reqBody
    );
  }

  postNewScriptSectionObservable(reqBody: { summary: string, style: string, point: string}): Observable<{ message: string, result: { script: string } }> {
    const currLang = this.translate.currentLang;
    return this.http.post<{ message: string, result: { script: string } }>(
      `http://localhost:3000/api/openai/new/script/${currLang}`,
      reqBody
    );
  }

  postOptimizeScriptSectionObservable(reqBody: { current: string }): Observable<{ message: string, result: { script: string } }> {
    const currLang = this.translate.currentLang;
    return this.http.post<{ message: string, result: { script: string } }>(
      `http://localhost:3000/api/openai/improve/script/${currLang}`,
      reqBody
    );
  }

  postNewTagsObservable(reqBody: {
    summary: string;
    style: string;
  }): Observable<{ message: string; result: { tags: string } }> {
    const currLang = this.translate.currentLang;
    return this.http.post<{ message: string; result: { tags: string } }>(
      `http://localhost:3000/api/openai/new/tags/${currLang}`,
      reqBody
    );
  }

  postOptimizedTagsObservable(reqBody: {
    current: string;
  }): Observable<{ message: string; result: { tags: string } }> {
    const currLang = this.translate.currentLang;
    return this.http.post<{ message: string; result: { tags: string } }>(
      `http://localhost:3000/api/openai/improve/tags/${currLang}`,
      reqBody
    );
  }
}
