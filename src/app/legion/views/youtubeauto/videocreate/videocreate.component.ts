import {
  AfterContentInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { GenerateContentService } from '../../../service/content/generation.service';
import {
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import { NavigationService } from '../../../service/navigation.service';
import{ AutoContentRepository } from '../../../repository/content/autocontent.repo';
import { VideoNiche } from '../../../model/autocreate/videoniche.model';
import { VideoDuration } from '../../../model/autocreate/videoduration.model';
import { VideoDetailsService } from '../videodetails.service';

@Component({
  selector: 'video-create',
  templateUrl: './videocreate.component.html',
  styleUrls: ['./videocreate.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default,
})
export class VideoCreateComponent implements OnInit, AfterContentInit {

  gptResponse: string = 'Waiting for response...';

  topicFormGroup: FormGroup;
  styleFormGroup: FormGroup;
  durationFormGroup: FormGroup;

  videoNiches: VideoNiche[] = [];
  selectedVideoNiche: VideoNiche = {
    name: '',
    header: '',
    description: '',
    value: ''
  }
  videoDurations: VideoDuration[] = [];
  selectedVideoDuration: VideoDuration = {
    name: '',
    header: '',
    description: '',
    sections: []
  }

  topicLoading: boolean = false;
  hasError = false;
  inputErrorText = 'Please fill out all fields.';

  constructor(
    private contentModel: AutoContentRepository,
    private videoDetailsService: VideoDetailsService,
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
    this.videoDetailsService.getInitVideoNiche().subscribe((response) => {
      this.selectedVideoNiche = response;
    });
    this.videoDetailsService.getInitVideoDurationObserver().subscribe((response) => {
      this.selectedVideoDuration = response;
    });
    this.videoDetailsService.getTopicObserver().subscribe((response) => {
      this.topicLoading = false;
      this.topicFormGroup.setValue({
        topic: response.replaceAll('"', '').trim()
      })
    });
    this.videoDetailsService.getDefaultVideoNichesObserver().subscribe((response) => {
      this.videoNiches = response;
    });
    this.videoDetailsService.getDefaultVideoDurationsObserver().subscribe((response) => {
      this.videoDurations = response;
    });
    this.videoDetailsService.getErrorObservable().subscribe((response) => {
      this.hasError = true;
      this.inputErrorText = response;
    });
    this.contentModel.getDefaultVideoNiches();
  }

  reRollTopic() { 
    this.topicLoading = true;
    this.videoDetailsService.reRollTopic();
  }

  onVideoOptionSelected(option: VideoNiche) {
    this.selectedVideoNiche = option;
  }

  onVideoDurationSelected(option: VideoDuration) {
    this.selectedVideoDuration = option;
  }

  onSubmit() {
    this.topicFormGroup.markAsTouched();
    this.styleFormGroup.markAsTouched();
    this.durationFormGroup.markAsTouched();

    if (this.topicFormGroup.invalid || this.styleFormGroup.invalid || this.durationFormGroup.invalid) {
      this.hasError = true;
    } else {
      this.hasError = false;
      this.videoDetailsService.submitCreate(
        this.topicFormGroup.value.topic,
        this.styleFormGroup.value.selectedStyle,
        this.durationFormGroup.value.selectedDuration
      )
    }
  }
}
