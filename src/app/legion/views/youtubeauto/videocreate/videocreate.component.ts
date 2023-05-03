import {
  AfterContentInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { GptService } from '../../../service/gpt.service';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
  FormArray,
} from '@angular/forms';
import { NavigationService } from '../../../service/navigation.service';
import { AutoContentRepository } from '../../../model/youtubeauto/autocontent.repo';
import { VideoNiche as VideoNiche } from '../../../model/youtubeauto/create/videoniche.model';
import { VideoDuration } from '../../../model/youtubeauto/create/videoduration.model';

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
  selectedVideoNiche: VideoNiche = {
    name: '',
    header: '',
    description: '',
  }
  videoDurations: VideoDuration[] = [];
  selectedVideoDuration: VideoDuration = {
    name: '',
    header: '',
    description: '',
    sections: []
  }
  moneyOptions = [ 'Ad Sense',  'Affiliate' ]
  selectedMonitizationOption = '';

  topicLoading: boolean = false;
  hasInputError = false;

  constructor(
    private gptService: GptService,
    private contentRepo: AutoContentRepository,
    private navigationService: NavigationService,
    private _formBuilder: FormBuilder,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.setupObservers();
    this.setupForms()
  }

  ngAfterContentInit(): void {
    this.changeDetectorRef.detectChanges();
  }

  private setupForms() {
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

  private setupObservers() {
    this.contentRepo.getInitVideoNiche().subscribe((response) => {
      this.selectedVideoNiche = response;
    });
    this.contentRepo.getInitVideoDuration().subscribe((response) => {
      this.selectedVideoDuration = response;
    });
    this.gptService.getTopicObserver().subscribe((response) => {
      this.topicLoading = false;
      this.topicFormGroup.setValue({
        topic: response.replace('"', '').trim()
      })
    });
    this.contentRepo.getVideoOptionsObserver().subscribe((response) => {
      this.videoNiches = response;
    });
    this.contentRepo.getDurationOptionsObserver().subscribe((response) => {
      this.videoDurations = response;
    });
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
      this.contentRepo.submitInputs(
        this.topicFormGroup.value.topic,
        this.styleFormGroup.value.selectedStyle,
        this.durationFormGroup.value.selectedDuration
      );
      this.navigationService.navigateToResults();
    }
  }
}
