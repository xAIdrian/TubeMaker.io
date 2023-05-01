import {
  AfterContentInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { GptService } from '../service/gpt/gpt.service';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
  FormArray,
} from '@angular/forms';
import { NavigationService } from '../service/navigation.service';
import { ContentService } from '../service/content/content.service';
import { VideoStyle } from '../model/create/videostyle.model';
import { VideoDuration } from '../model/create/videoduration.model';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'video-create',
  templateUrl: './videocreate.component.html',
  styleUrls: ['./videocreate.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default,
})
export class VideoCreateComponent implements OnInit, AfterContentInit {

  promptQuery: any;
  gptResponse: string = 'Waiting for response...';

  isLinear: any;
  topicFormGroup: FormGroup;
  styleFormGroup: FormGroup;
  durationFormGroup: FormGroup;
  moneyFormGroup: FormGroup;

  videoStyles: VideoStyle[] = [];
  selectedVideoOption: VideoStyle;
  durationOptions: VideoDuration[] = [];
  selectedDurationOption: VideoDuration;
  moneyOptions = [ 'Ad Sense',  'Affiliate' ]
  selectedMonitizationOption = '';

  topicLoading: boolean = false;
  hasInputError = false;

  constructor(
    private gptService: GptService,
    private contentService: ContentService,
    private translate: TranslateService,
    private navigationService: NavigationService,
    private _formBuilder: FormBuilder,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.setupObservers();

    this.selectedVideoOption  = { 
      name: '',
      header: 'Select The Style For Your Video',
      description: 'Each video needs a specific style and tone to present the information.  It needs to be captivating and engaging.  Remember to align the style of your video with proven trends in your selected niche',
      channelExamples: []
    }
    this.selectedDurationOption = { 
      name: '',
      header: 'Select The Duration For Your Video',
      description: 'Each video needs a specific duration present the information.  It needs to be captivating and engaging.  Remember to align the style of your video with proven trends in your selected niche',
      sections: []
    }

    this.topicFormGroup = this._formBuilder.group({
      topic: ['', Validators.required],
    });
    this.styleFormGroup = this._formBuilder.group({
      selectedStyle: ['', Validators.required],
    });
    this.durationFormGroup = this._formBuilder.group({
      selectedDuration: ['', Validators.required],
    });
    this.moneyFormGroup = this._formBuilder.group({
      selectedMonetization: [''],
      productName: [''],
      productDescription: [''],
      links: this._formBuilder.array([]) // Add FormArray to the FormGroup
    });
  }

  ngAfterContentInit(): void {
    this.changeDetectorRef.detectChanges();
  }

  setupObservers() {
    this.gptService.getTopicObserver().subscribe((response) => {
      this.topicLoading = false;
      this.topicFormGroup.setValue({
        topic: response.replace('"', '').trim()
      })
    });
    this.contentService.getVideoOptionsObserver().subscribe((response) => {
      this.videoStyles = response;
    });
    this.contentService.getDurationOptionsObserver().subscribe((response) => {
      this.durationOptions = response;
    });
  }

  // Helper method to get links FormArray
  get links(): FormArray {
    return this.moneyFormGroup.get('links') as FormArray;
  }

  // Method to add a new input to links FormArray
  addLink() {
    this.links.push(this._formBuilder.control(''));
  }

  reRollTopic() { 
    this.topicLoading = true;
    this.gptService.updateNewTopic() 
  }

  onVideoOptionSelected(option: VideoStyle) {
    this.selectedVideoOption = option;
  }

  onVideoDurationSelected(option: VideoDuration) {
    this.selectedDurationOption = option;
  }

  onMoneyOptionSelected(selectedOption: string) {
    this.selectedMonitizationOption = selectedOption
  }

  onSubmit() {
    this.topicFormGroup.markAsTouched();
    this.styleFormGroup.markAsTouched();
    this.durationFormGroup.markAsTouched();

    if (this.topicFormGroup.invalid || this.styleFormGroup.invalid || this.durationFormGroup.invalid) {
      this.hasInputError = true;
    } else {
      this.hasInputError = false;
      this.contentService.submitInputs(
        this.topicFormGroup.value.topic,
        this.styleFormGroup.value.selectedStyle,
        this.durationFormGroup.value.selectedDuration
      );
      this.navigationService.navigateToResults();
    }
  }
}
