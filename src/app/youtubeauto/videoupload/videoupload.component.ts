import {
  AfterContentInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { NavigationService } from '../service/navigation.service';
import { ContentService } from '../service/content.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import { YoutubeService } from '../service/youtube.service';

@Component({
  selector: 'video-upload',
  templateUrl: './videoupload.component.html',
  styleUrls: ['./videoupload.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default,
})
export class VideoUploadComponent implements OnInit, AfterContentInit {

  isWindowLoaded = false;

  resultsFormGroup: FormGroup;
  uploadFormGroup: FormGroup;

  videoUrlPath: SafeUrl;
  imageUrlPath: SafeUrl;
  audioUrlPath: SafeUrl;
  
  constructor(
    private contentService: ContentService,
    private navigationService: NavigationService,
    private _formBuilder: FormBuilder,
    private changeDetectorRef: ChangeDetectorRef,
    private sanitizer: DomSanitizer,
    private youtubeService: YoutubeService
  ) {}

  ngOnInit(): void {
    // @ts-ignore
    window.onGoogleLibraryLoad = () => {
      console.log("🚀 ~ file: videoupload.component.ts:50 ~ VideoUploadComponent ~ ngOnInit ~ onGoogleLibraryLoad:")
      this.youtubeService.initTokenClient();
    };

    this.setupObservers();
    this.setupFormGroups();
  }

  ngAfterContentInit(): void {
    this.changeDetectorRef.detectChanges();
    // this.contentService.getLatest();
  }

  setupFormGroups() {
    this.resultsFormGroup = this._formBuilder.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      script: ['', Validators.required],
      tags: ['', Validators.required],
    });
    this.uploadFormGroup = this._formBuilder.group({
      audioFile: ['', Validators.required],
      videoFile: ['', Validators.required],
      imageFile: ['', Validators.required],
      isMadeForKids: [false],
    });
  }

  setupObservers() {
    this.contentService.getContentObserver().subscribe((content) => {
      this.resultsFormGroup.setValue({
        title: content.title,
        description: content.description,
        script: content.script,
        tags: content.tags,
      });
    });
    this.contentService.getMediaObserver().subscribe((media) => {
      this.imageUrlPath = this.sanitizer.bypassSecurityTrustUrl(
        media.image.file
      );
      this.videoUrlPath = this.sanitizer.bypassSecurityTrustUrl(
        media.video.file
      );
      this.audioUrlPath = this.sanitizer.bypassSecurityTrustUrl(
        media.audio.file
      );
    });
    this.youtubeService.getTokenSuccessObserver().subscribe((success) => {
      console.log("🚀 ~ file: videoupload.component.ts:123 ~ VideoUploadComponent ~ this.youtubeService.getTokenSuccessObserver ~ token", success)
      if (success) {
        this.youtubeService.getChannels().subscribe((channels) => {
            console.log("🚀 ~ file: videoupload.component.ts:82 ~ VideoUploadComponent ~ loginOnClick ~ channels", channels)
            let channelId = channels.items[0].id
            let url = `https://studio.youtube.com/channel/${channelId}/videos/upload?d=ud`
            window.open(url, '_blank');
        });
      }
    });
  }

  loginOnClick() {
    this.youtubeService.requestAccessToken();
  }

  onMadeForKidsClicked(isForKids: boolean) {
    this.uploadFormGroup.patchValue({
      isMadeForKids: isForKids,
    });
  }

  copyTitle() {
    throw new Error('Method not implemented.');
  }

  onResetMedia() {
    this.navigationService.navigateToResults();
  }
  
  onResetContent() {
    this.navigationService.navigateToCreateVideo();
  }
}
