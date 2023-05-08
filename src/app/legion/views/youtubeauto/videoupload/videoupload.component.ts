import {
  AfterContentInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { NavigationService } from '../../../service/navigation.service';
import{ AutoContentModel } from '../../../model/autocontent.model';
import { ExtractDetailsService } from '../../youtubeextract/extractdetails.service';
import { Clipboard } from '@angular/cdk/clipboard';

@Component({
  selector: 'video-upload',
  templateUrl: './videoupload.component.html',
  styleUrls: ['./videoupload.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default,
})
export class VideoUploadComponent implements OnInit, AfterContentInit {

  isWindowLoaded = false;

  title: string;
  showTitleBadge = false;
  description: string;
  showDescriptionBadge = false;
  tags: string;
  showTagsBadge = false;
  script: string;
  showScriptBadge = false;
  
  constructor(
    private contentRepo: AutoContentModel,
    private navigationService: NavigationService,
    private changeDetectorRef: ChangeDetectorRef,
    private youtubeService: ExtractDetailsService,
    private clipboard: Clipboard
  ) {}

  ngOnInit() {
    // @ts-ignore
    window.onGoogleLibraryLoad = () => {
      console.log("🚀 ~ file: videoupload.component.ts:50 ~ VideoUploadComponent ~ ngOnInit ~ onGoogleLibraryLoad:")
      // this.youtubeService.initTokenClient();
    };
  }

  ngAfterContentInit() {
    this.title = this.contentRepo.getTitle();
    this.description = this.contentRepo.getDescription();
    this.tags = this.contentRepo.getTags();
    this.script = this.contentRepo.getCompleteScriptFromMap();

    this.changeDetectorRef.detectChanges();
  }

  copyTitle() { 
    this.showTitleBadge = true;
    this.clipboard.copy(this.title);
    setTimeout(() => this.showTitleBadge = false, 1000);  
  }

  copyDescription() { 
    this.showDescriptionBadge = true;
    this.clipboard.copy(this.description); 
    setTimeout(() => this.showDescriptionBadge = false, 1000); 
  }

  copyTags() { 
    this.showTagsBadge = true;
    this.clipboard.copy(this.tags); 
    setTimeout(() => this.showTagsBadge = false, 1000); 
  }

  copyScript() { 
    this.showScriptBadge = true;
    this.clipboard.copy(this.script); 
    setTimeout(() => this.showScriptBadge = false, 1000); 
  }

  onResetMedia() {
    this.navigationService.navigateToResults();
  }
  
  onResetContent() {
    this.navigationService.navigateToCreateVideo();
  }
}
