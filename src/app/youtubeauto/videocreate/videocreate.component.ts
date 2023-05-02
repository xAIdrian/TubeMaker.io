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
import { VideoNiche as VideoNiche } from '../model/create/videoniche.model';
import { VideoDuration } from '../model/create/videoduration.model';

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

  videoNiches: VideoNiche[] = [];
  selectedVideoNiche: VideoNiche;
  videoDurations: VideoDuration[] = [];
  selectedVideoDuration: VideoDuration;
  moneyOptions = [ 'Ad Sense',  'Affiliate' ]
  selectedMonitizationOption = '';

  topicLoading: boolean = false;
  hasInputError = false;

  constructor(
    private gptService: GptService,
    private contentService: ContentService,
    private navigationService: NavigationService,
    private _formBuilder: FormBuilder,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.setupObservers();

    this.contentService.getInitVideoNiche().subscribe((response) => {
      this.selectedVideoNiche = response;
    });
    this.contentService.getInitVideoDuration().subscribe((response) => {
      this.selectedVideoDuration = response;
    });

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
    // this.contentService.getDurationOptionsObserver();
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
      this.videoNiches = response;
    });
    this.contentService.getDurationOptionsObserver().subscribe((response) => {
      this.videoDurations = response;
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

  onVideoOptionSelected(option: VideoNiche) {
    this.selectedVideoNiche = option;
  }

  onVideoDurationSelected(option: VideoDuration) {
    this.selectedVideoDuration = option;
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
