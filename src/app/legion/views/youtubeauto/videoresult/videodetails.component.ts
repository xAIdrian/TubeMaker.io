import {
  AfterContentInit,
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { NavigationService } from '../../../service/navigation.service';
import {
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';

import { VideoDetailsService } from '../videodetails.service';
import { VideoDuration } from '../../../model/autocreate/videoduration.model';
import { VideoMetadata } from 'src/app/legion/model/video/videometadata.model';
import { Clipboard } from '@angular/cdk/clipboard';

@Component({
  selector: 'video-result',
  templateUrl: './videodetails.component.html',
  styleUrls: ['./videodetails.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default,
})
export class VideoDetailsComponent implements OnInit, AfterContentInit, AfterViewInit {

  //debug variable to be removed
  isInDebugMode: boolean = false;
  ////////////////////////////
  
  scriptFormGroup: FormGroup;
  currentVideoDuration: VideoDuration;

  contentProgressValue: number = 0;
  contentProgressLabel: string = 'Please wait...';
  scriptProgressValue: number = 0;
  scriptProgressLabel: string = 'Waking up your AI...';

  isLinear: any;
  hasInputError = false;
  contentGenerationIsLoading: boolean = !this.isInDebugMode //should be set to true in production;

  isTitleLoading: boolean = false;
  isDescLoading: boolean = false;
  isTagsLoading: boolean = false;
  isScriptLoading: boolean = false;

  infoFormGroup: FormGroup;

  showTitleBadge = false;
  showDescriptionBadge = false;
  showTagsBadge = false;

  constructor(
    private videoDetailsService: VideoDetailsService,
    private navigationService: NavigationService,
    private clipboard: Clipboard,
    private _formBuilder: FormBuilder,
    private changeDetectorRef: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    if (this.videoDetailsService.getCurrentTopic() === undefined && !this.isInDebugMode) {
      this.navigationService.navigateToCreateVideo();
      return
    }

    this.setupObservers();
    this.setupFormGroups();
  }

  ngAfterContentInit(): void {
    this.changeDetectorRef.detectChanges();
    
    if (!this.isInDebugMode) { this.videoDetailsService.generateVideoContentWithAI(); }
  }

  ngAfterViewInit(): void {
    this.contentProgressValue = 0;
    this.scriptProgressValue = 0;
  }

  isCurrentVideoPresent() {
    return this.videoDetailsService.hasVideoData();
  }

  setupObservers() {
    this.videoDetailsService.getContentProgressObserver().subscribe((response) => {
      this.contentProgressValue = this.contentProgressValue + response;
      if (this.contentProgressValue === 0) {
        this.contentProgressLabel = 'Researching the competition...';
      } else if (this.contentProgressValue === 25) {
        this.contentProgressLabel = 'Analyzing the market...';
      } else if (this.contentProgressValue === 50) {
        this.contentProgressLabel = 'Predicting trends...';
      } else if (this.contentProgressValue === 75) {
        this.contentProgressLabel = 'Searching youtube...';
      } else if (this.contentProgressValue === 100) {
        this.contentProgressLabel = 'Done. Moving to script.';
      }
      this.changeDetectorRef.detectChanges();
    });
    this.videoDetailsService.getScriptProgressObserver().subscribe((response) => {
      this.scriptProgressValue = this.scriptProgressValue + response.increment;
      console.log("🚀 ~ file: videodetails.component.ts:116 ~ VideoDetailsComponent ~ this.contentService.getScriptProgressObserver ~ response:", response)
      console.log("🚀 ~ file: videodetails.component.ts:124 ~ VideoDetailsComponent ~ this.contentService.getScriptProgressObserver ~ scriptProgressValue:", this.scriptProgressValue)
      this.scriptProgressLabel = response.label;

      if (this.scriptProgressValue >= 97) {
        this.scriptProgressLabel = 'Done!';
        setTimeout(() => {
          this.contentGenerationIsLoading = false;
          this.contentProgressValue = 0;
          this.scriptProgressValue = 0;
        }, 1000);
      }
    });

    this.videoDetailsService.getCompleteResultsObserver().subscribe(
      (response: { meta: VideoMetadata }) => {
        this.infoFormGroup.setValue({
          title: response.meta.title.replace('"', '').trim(),
          description: response.meta.description.trim(),
          tags: response.meta.tags.join(' #').trim(),
        });
      }
    );

    this.videoDetailsService.getTitleObserver().subscribe((response) => {
      this.isTitleLoading = false;
      this.infoFormGroup.patchValue({ title: response.replace('"', '').trim() })
    });

    this.videoDetailsService.getDescriptionObserver().subscribe((response) => {
      this.isDescLoading = false;
      this.infoFormGroup.patchValue({ description: response.trim() })
    });

    this.videoDetailsService.getTagsObserver().subscribe((response) => {  
      this.isTagsLoading = false;
      this.infoFormGroup.patchValue({ tags: response.join(', ').trim() })
    });

    this.videoDetailsService.getScriptSectionObserver().subscribe((response) => {      
      console.log("🚀 ~ file: videodetails.component.ts:156 ~ VideoDetailsComponent ~ this.contentService.getScriptSectionObserver ~ response:", response)
      switch (response.position) { 
        case 'introduction':
          this.scriptFormGroup.patchValue({ introduction: response.scriptSection })
          break;
        case 'mainContent':
          this.scriptFormGroup.patchValue({ mainContent: response.scriptSection })
          break;
        case 'conclusion':
          this.scriptFormGroup.patchValue({ conclusion: response.scriptSection })
          break;
        case 'questions':
          this.scriptFormGroup.patchValue({ questions: response.scriptSection })
          break;
        case 'opinions':
          this.scriptFormGroup.patchValue({ opinions: response.scriptSection })
          break;
        case 'caseStudies':
          this.scriptFormGroup.patchValue({ caseStudies: response.scriptSection })
          break;
        case 'actionables':
          this.scriptFormGroup.patchValue({ actionables: response.scriptSection })
          break;
        default:
          console.log("🔥 ~ file: videoscript.component.ts:85 ~ VideoScriptComponent ~ this.contentService.getScriptSectionObserver ~ default:")
          break;
      }
    });
  }

  setupFormGroups() {
    this.infoFormGroup = this._formBuilder.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      tags: ['', Validators.required],
    });

    this.scriptFormGroup = this._formBuilder.group({
      introduction: ['', Validators.required],
      mainContent: ['', Validators.required],
      conclusion: ['', Validators.required],
      questions: [''],
      opinions: [''],
      caseStudies: [''],
      actionables: [''],
    });
  }

  onScriptFormGroupChange(childFormGroup: FormGroup) {
    this.scriptFormGroup = childFormGroup;
  }

  onTitleImproveClick(prompt: string) {
    this.isTitleLoading = true;
    this.videoDetailsService.updateTitle(
      prompt,
      this.infoFormGroup.value.title
    )
  }

  onDescriptionImproveClick(prompt: string) {
    this.isDescLoading = true;
    this.videoDetailsService.updateDescription(
      prompt,
      this.infoFormGroup.value.description
    )
  }

  rerollTags() {
    this.isTagsLoading = true;
    this.videoDetailsService.updateTags(
      this.infoFormGroup.value.title,
      this.infoFormGroup.value.description
    )
  }

  copyTitle() {
    this.showTitleBadge = true;
    this.clipboard.copy(this.infoFormGroup.value.title);
    setTimeout(() => this.showTitleBadge = false, 1000); 
  }

  copyDescription() {
    this.showTitleBadge = true;
    this.clipboard.copy(this.infoFormGroup.value.description);
    setTimeout(() => this.showDescriptionBadge = false, 1000); 
  }

  copyTags() {
    this.showTagsBadge = true;
    this.clipboard.copy(this.infoFormGroup.value.tags);
    setTimeout(() => this.showTagsBadge = false, 1000);
  }

  goToReview() {
    this.navigationService.navigateToUploadVideo();
  }

  onReset() {
    this.navigationService.navigateToCreateVideo();
  }
}
