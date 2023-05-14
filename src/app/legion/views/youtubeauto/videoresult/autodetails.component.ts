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
import { DetailsComponent } from '../../common/details/details.component';
import { VideoDuration } from '../../../model/autocreate/videoduration.model';
import { VideoMetadata } from 'src/app/legion/model/video/videometadata.model';
import { YoutubeAutoService } from '../youtubeauto.service';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'auto-details',
  templateUrl: './autodetails.component.html',
  styleUrls: ['./autodetails.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default,
})
export class AutoDetailsComponent extends DetailsComponent implements OnInit, AfterContentInit, AfterViewInit {
  
  currentVideoDuration: VideoDuration;

  contentProgressValue: number = 0;
  contentProgressLabel: string = 'Please wait...';
  scriptProgressValue: number = 0;
  scriptProgressLabel: string = 'Waking up your AI...';

  hasInputError = false;
  contentGenerationIsLoading: boolean = true;

  isScriptLoading: boolean = false;
  isScriptOptimizing: boolean = false;

  infoFormGroup: FormGroup;
  isInDebugMode: any;

  constructor(
    private autoService: YoutubeAutoService,
    sanitizer: DomSanitizer,
    activatedRoute: ActivatedRoute, 
    changeDetectorRef: ChangeDetectorRef,
) {
    super(
      autoService,
      sanitizer,
      activatedRoute,
      changeDetectorRef
    );
}

  override ngOnInit(): void {
    super.ngOnInit();
    this.autoService.checkCurrentTopic();
    this.setupObservers();
  }

  override ngAfterContentInit(): void {
    super.ngAfterContentInit();
    if (!this.isInDebugMode) { this.autoService.generateVideoContentWithAI(); }
  }

  ngAfterViewInit(): void {
    this.contentProgressValue = 0;
    this.scriptProgressValue = 0;
  }

  override setupObservers() {
    super.setupObservers();
    
    this.autoService.getContentProgressObserver().subscribe((response) => {
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
    
    this.autoService.getScriptProgressObserver().subscribe((response) => {
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

    this.autoService.getCompleteResultsObserver().subscribe(
      (response: { meta: VideoMetadata }) => {
        this.infoFormGroup.setValue({
          title: response.meta.title.replace('"', '').trim(),
          description: response.meta.description.trim(),
          tags: response.meta.tags.join(', ').trim(),
        });
      }
    );

    this.autoService.getScriptSectionObserver().subscribe((response) => {      
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
}
