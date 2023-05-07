import {
  AfterContentInit,
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { NavigationService } from '../../../../service/navigation.service';
import {
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';

import { GptGeneratedMetaData } from '../../../../model/gpt/gptgeneratedvideo.model';
import { ContentGenerationService } from '../../../../service/contentgeneration.service';
import{ AutoContentModel } from '../../../../model/autocontent.model';
import { VideoDuration } from '../../../../model/autocreate/videoduration.model';

@Component({
  selector: 'video-result',
  templateUrl: './videodetails.component.html',
  styleUrls: ['./videodetails.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default,
})
export class VideoDetailsComponent implements OnInit, AfterContentInit, AfterViewInit {

  //debug variable to be removed
  isInDebugMode: boolean = true;
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
  isTitleOptimizing: boolean = false;

  isDescLoading: boolean = false;
  isDescOptimizing: boolean = false;

  isScriptLoading: boolean = false;
  isScriptOptimizing: boolean = false;

  isTagsLoading: boolean = false;
  isTagsOptimizing: boolean = false;

  infoFormGroup: FormGroup;

  gptResponseTitle: string = 'Waiting for title...';
  gptResponseDescription: string = 'Waiting for desc...';
  gptResponseScript: string = 'Waiting for script...';
  gptResponseTags: string = 'Waiting for tags...';

  constructor(
    private gptService: ContentGenerationService,
    private contentRepo: AutoContentModel,
    private navigationService: NavigationService,
    private _formBuilder: FormBuilder,
    private changeDetectorRef: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    if (this.contentRepo.getCurrentTopic() === undefined && !this.isInDebugMode) {
      this.navigationService.navigateToCreateVideo();
      return
    }

    this.setupObservers();
    this.setupFormGroups();
  }

  ngAfterContentInit(): void {
    this.changeDetectorRef.detectChanges();
    
    if (!this.isInDebugMode) { this.gptService.generateVideoContentWithAI(); }
  }

  ngAfterViewInit(): void {
    this.contentProgressValue = 0;
    this.scriptProgressValue = 0;
  }

  setupObservers() {
    this.gptService.getContentProgressObserver().subscribe((response) => {
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
    this.gptService.getScriptProgressObserver().subscribe((response) => {
      this.scriptProgressValue = this.scriptProgressValue + response.increment;
      console.log("🚀 ~ file: videodetails.component.ts:116 ~ VideoDetailsComponent ~ this.gptService.getScriptProgressObserver ~ response:", response)
      console.log("🚀 ~ file: videodetails.component.ts:124 ~ VideoDetailsComponent ~ this.gptService.getScriptProgressObserver ~ scriptProgressValue:", this.scriptProgressValue)
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

    this.gptService.getCompleteResultsObserver().subscribe(
      (response: { meta: GptGeneratedMetaData }) => {
        this.infoFormGroup.setValue({
          title: response.meta.title.replace('"', '').trim(),
          description: response.meta.description.trim(),
          tags: response.meta.tags.join(', ').trim(),
        });
      }
    );
    this.gptService.getTitleObserver().subscribe((response) => {
      this.isTitleLoading = false;
      this.isTitleOptimizing = false;
      this.infoFormGroup.patchValue({ title: response.replace('"', '').trim() })
    });
    this.gptService.getDescriptionObserver().subscribe((response) => {
      this.isDescLoading = false;
      this.isDescOptimizing = false;
      this.infoFormGroup.patchValue({ description: response.trim() })
    });
    this.gptService.getTagsObserver().subscribe((response) => {  
      this.isTagsLoading = false;
      this.isTagsOptimizing = false;
      this.infoFormGroup.patchValue({ tags: response.join(', ').trim() })
    });
    this.gptService.getScriptSectionObserver().subscribe((response) => {      
      console.log("🚀 ~ file: videodetails.component.ts:156 ~ VideoDetailsComponent ~ this.gptService.getScriptSectionObserver ~ response:", response)
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
          console.log("🔥 ~ file: videoscript.component.ts:85 ~ VideoScriptComponent ~ this.gptService.getScriptSectionObserver ~ default:")
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

  rerollTitle() {
    this.isTitleLoading = true;
    this.infoFormGroup.patchValue({ title: 'Please wait...' })
    this.gptService.updateNewTitle();
  }

  rerollDescription() {
    this.isDescLoading = true;
    this.infoFormGroup.patchValue({ description: 'Please wait...' })
    this.gptService.updateNewDescription();
  }

  rerollTags() {
    this.isTagsLoading = true;
    this.infoFormGroup.patchValue({ tags: 'Please wait...' })
    this.gptService.updateNewTags();
  }

  onInfoSectionClick() {
    this.contentRepo.submitInfos(
      this.infoFormGroup.value.title,
      this.infoFormGroup.value.description,
      this.infoFormGroup.value.tags,
    );
  }

  goToReview() {
    this.navigationService.navigateToUploadVideo();
  }

  onReset() {
    this.navigationService.navigateToCreateVideo();
  }
}
