import {
  AfterContentInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { NavigationService } from '../../../service/navigation.service';
import{ AutoContentModel } from '../../../model/autocontent.model';
import { YoutubeService } from '../../../service/youtube.service';
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
    private youtubeService: YoutubeService,
    private clipboard: Clipboard
  ) {}

  ngOnInit() {
    // @ts-ignore
    window.onGoogleLibraryLoad = () => {
      console.log("🚀 ~ file: videoupload.component.ts:50 ~ VideoUploadComponent ~ ngOnInit ~ onGoogleLibraryLoad:")
      // this.youtubeService.initTokenClient();
    };
    this.setupObservers();
  }

  ngAfterContentInit() {
    this.title = this.contentRepo.getTitle();
    this.description = this.contentRepo.getDescription();
    this.tags = this.contentRepo.getTags();
    this.script = this.contentRepo.getCompleteScript();

    this.changeDetectorRef.detectChanges();
  }

  setupObservers() {
    this.youtubeService.getTokenSuccessObserver().subscribe((success) => {
      console.log("🚀 ~ file: videoupload.component.ts:123 ~ VideoUploadComponent ~ this.youtubeService.getTokenSuccessObserver ~ token", success)
      if (success) {
        // this.youtubeService.getChannels().subscribe((channels) => {
        //     console.log("🚀 ~ file: videoupload.component.ts:82 ~ VideoUploadComponent ~ loginOnClick ~ channels", channels)
        //     let channelId = channels.items[0].id
        //     let url = `https://studio.youtube.com/channel/${channelId}/videos/upload?d=ud`
        //     window.open(url, '_blank');
        // });
      }
    });
  }

  loginOnClick() {
    this.youtubeService.requestAccessToken();
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
