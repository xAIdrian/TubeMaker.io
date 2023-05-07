import {
  AfterContentInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { ContentGenerationService } from '../../../service/contentgeneration.service';
import {
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import { NavigationService } from '../../../service/navigation.service';
import{ AutoContentModel } from '../../../model/autocontent.model';
import { VideoNiche as VideoNiche } from '../../../model/autocreate/videoniche.model';
import { VideoDuration } from '../../../model/autocreate/videoduration.model';

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
    private gptService: ContentGenerationService,
    private contentRepo: AutoContentModel,
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
  }

  private setupObservers() {
    this.contentRepo.getInitVideoNiche(
      'video_style.init_header',
      'video_style.init_description'
    ).subscribe((response) => {
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
    this.contentRepo.getDefaultVideoNichesObserver().subscribe((response) => {
      this.videoNiches = response;
    });
    this.contentRepo.getDefaultVideoDurationsObserver().subscribe((response) => {
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
