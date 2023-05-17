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
import { ActivatedRoute, ParamMap } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { YoutubeVideoPage } from 'src/app/legion/model/youtubevideopage.model';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'video-result',
  templateUrl: './videodetails.component.html',
  styleUrls: ['./videodetails.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default,
})
export class VideoDetailsComponent implements OnInit, AfterContentInit {
  
  scriptFormGroup: FormGroup;

  contentProgressValue: number = 0;
  contentProgressLabel: string;
  scriptProgressValue: number = 0;
  scriptProgressLabel: string;

  isLinear: any;
  hasInputError = false;
  contentGenerationIsLoading: boolean = true;

  isTitleLoading: boolean = false;
  isDescLoading: boolean = false;
  isTagsLoading: boolean = false;
  isScriptLoading: boolean = false;

  infoFormGroup: FormGroup;

  showTitleBadge = false;
  showDescriptionBadge = false;
  showTagsBadge = false;

  isErrorVisible = false;
  errorText = false;

  //output observables for all of our ViewChilds
  currentPageId: string;
  currentVideoDuration: VideoDuration;


  constructor(
    private activatedRoute: ActivatedRoute,
    private videoDetailsService: VideoDetailsService,
    private navigationService: NavigationService,
    private clipboard: Clipboard,
    private _formBuilder: FormBuilder,
    private changeDetectorRef: ChangeDetectorRef,
    private translate: TranslateService,
  ) {}

  ngOnInit(): void {
    let pathId: string = '';
        // TODO refresh page get item BUT it must be from firebase
        // if (localStorage.getItem('detailsId') !== null && localStorage.getItem('detailsId') !== '') {
        //     console.log("🚀 ~ file: extractdetails.component.ts:47 ~ ExtractDetailsComponent ~ ngOnInit ~ localStorage.getItem('detailsId'):", localStorage.getItem('detailsId'))
        //     pathId = localStorage.getItem('detailsId')!!;
        // } 
        this.activatedRoute.paramMap.subscribe((params: ParamMap) => {
            if (params.has('id')) {
              this.translate.get('video_details.simple_content_progress_label').subscribe((res: string) => {
                this.contentProgressLabel = res;
                this.contentProgressValue = 100;
              });
              this.translate.get('video_details.simple_script_progress_label').subscribe((res: string) => {
                this.scriptProgressLabel = res;
              });

                pathId = params.get('id')!!;
                this.videoDetailsService.getCurrentPage(pathId).subscribe({
                    next: (page: YoutubeVideoPage) => {
                      this.scriptProgressValue = 100;
                        setTimeout(() => {
                          this.contentGenerationIsLoading = false;
                          this.contentProgressValue = 0;
                          this.scriptProgressValue = 0;
                        }, 500);

                        this.currentPageId = page.id ?? '';
                        // this.currentDuration = page.currentDuration
                        console.log("🚀 ~ file: videodetails.component.ts:101 ~ VideoDetailsComponent ~ this.videoDetailsService.getCurrentPage ~ currentPageId:", this.currentPageId)

                        this.infoFormGroup.setValue({
                          title: page.metadata?.title.replaceAll('"', '').trim(),
                          description: page.metadata?.description.trim(),
                          tags: page.metadata?.tags.join(' #').trim(),
                        });

                        if (page.structuredScript !== undefined || page.structuredScript !== null) {
                          console.log(typeof page.structuredScript)
                          for (const [key, value] of Object.entries(page.structuredScript!!)) {
                            console.log("🚀 ~ file: videodetails.component.ts:103 ~ VideoDetailsComponent ~ this.videoDetailsService.getCurrentPage ~ [key, value]:", [key, value])
                            if (value !== undefined && value !== '') {
                              this.assignScriptToFields(key, value)
                              // this.onScriptFormGroupChange();
                            }
                          }
                        }
                    },
                    error: (error: any) => {
                        console.log("🚀 ~ file: extractdetails.component.ts:65 ~ ExtractDetailsComponent ~ this.extractDetailsService.getCurrentPage ~ error:", error)
                        this.isErrorVisible = true;
                        this.errorText = error;
                    }
                });
            } else {
                this.currentPageId = '';
                this.videoDetailsService.generateVideoContentWithAI();
                console.log("🚀 ~ file: extractdetails.component.ts:72 ~ ExtractDetailsComponent ~ ngOnInit ~ this.currentPageId", this.currentPageId)
            }
        });

    this.setupObservers();
    this.setupFormGroups();
  }

  ngAfterContentInit(): void {
    this.contentProgressLabel = this.translate.instant('videodetails.contentProgressLabel');
    this.scriptProgressLabel = this.translate.instant('videodetails.scriptProgressLabel');
    this.translate.currentLang
    this.changeDetectorRef.detectChanges();
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
        this.scriptProgressLabel = 'Waking up your AI...';
      }
      this.changeDetectorRef.detectChanges();
    });
    this.videoDetailsService.getScriptProgressObserver().subscribe((response) => {
      this.scriptProgressValue = this.scriptProgressValue + response.increment; 
      this.scriptProgressLabel = response.label;

      if (this.scriptProgressValue >= 97) {
        this.scriptProgressLabel = 'Done!';
        setTimeout(() => {
          this.contentGenerationIsLoading = false;
          this.contentProgressValue = 0;
          this.scriptProgressValue = 0;
        }, 500);
      }
    });

    this.videoDetailsService.getCompleteResultsObserver().subscribe(
      (response: { meta: VideoMetadata }) => {
        this.infoFormGroup.setValue({
          title: response.meta.title.replaceAll('"', '').trim(),
          description: response.meta.description.trim(),
          tags: response.meta.tags.join(' #').trim(),
        });
      }
    );

    this.videoDetailsService.getTitleObserver().subscribe((response) => {
      this.isTitleLoading = false;
      this.infoFormGroup.patchValue({ title: response.trim() })
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
      this.assignScriptToFields(response.position, response.scriptSection)
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
    setTimeout(() => this.showTitleBadge = false, 500); 
  }

  copyDescription() {
    this.showTitleBadge = true;
    this.clipboard.copy(this.infoFormGroup.value.description);
    setTimeout(() => this.showDescriptionBadge = false, 500); 
  }

  copyTags() {
    this.showTagsBadge = true;
    this.clipboard.copy(this.infoFormGroup.value.tags);
    setTimeout(() => this.showTagsBadge = false, 500);
  }

  onReset() {
    this.navigationService.navigateToBrandNew(); 
  }

  private assignScriptToFields(key: any, response: any) {
    console.log("🚀 ~ file: videodetails.component.ts:281 ~ VideoDetailsComponent ~ assignScriptToFields ~ key: any, response: any:", key, response)
    
    switch (key) { 
      case 'introduction':
        this.scriptFormGroup.patchValue({ introduction: response })
        break;
      case 'mainContent':
        this.scriptFormGroup.patchValue({ mainContent: response })
        break;
      case 'conclusion':
        this.scriptFormGroup.patchValue({ conclusion: response })
        break;
      case 'questions':
        this.scriptFormGroup.patchValue({ questions: response })
        break;
      case 'opinions':
        this.scriptFormGroup.patchValue({ opinions: response })
        break;
      case 'caseStudies':
        this.scriptFormGroup.patchValue({ caseStudies: response })
        break;
      case 'actionables':
        this.scriptFormGroup.patchValue({ actionables: response })
        break;
      default:
        console.log("🔥 ~ file: videoscript.component.ts:85 ~ VideoScriptComponent ~ this.contentService.getScriptSectionObserver ~ default:")
        break;
    }
    return this.scriptFormGroup
  }
}

