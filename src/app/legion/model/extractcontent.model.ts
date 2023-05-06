import { Injectable } from "@angular/core";
import { ContentModel } from "./common/content.model";

@Injectable({
    providedIn: 'root',
  })
  export class ExtractContentModel extends ContentModel {

    scriptTotalNumberOfPoints: number;

    scriptMap: Map<string, string>;
    
    contentMap: Map<string, string>;
  }