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
import { YoutubeAutoService } from '../youtubeauto.service';

@Component({
  selector: 'video-create',
  templateUrl: './videocreate.component.html',
  styleUrls: ['./videocreate.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default,
})
export class VideoCreateComponent implements OnInit, AfterContentInit {

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
    private autoService: YoutubeAutoService,
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
    this.autoService.getInitVideoNiche().subscribe((response) => {
      this.selectedVideoNiche = response;
    });
    this.autoService.getInitVideoDurationObserver().subscribe((response) => {
      this.selectedVideoDuration = response;
    });
    this.autoService.getTopicObserver().subscribe((response) => {
      this.topicLoading = false;
      this.topicFormGroup.setValue({
        topic: response.replace('"', '').trim()
      })
    });
    this.autoService.getDefaultVideoNichesObserver().subscribe((response) => {
      this.videoNiches = response;
    });
    this.autoService.getDefaultVideoDurationsObserver().subscribe((response) => {
      this.videoDurations = response;
    });
    this.autoService.getErrorObservable().subscribe((response) => {
      this.hasError = true;
      this.inputErrorText = response;
    });
  }

  reRollTopic() { 
    this.topicLoading = true;
    this.autoService.reRollTopic();
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
      this.autoService.submitCreate(
        this.topicFormGroup.value.topic,
        this.styleFormGroup.value.selectedStyle,
        this.durationFormGroup.value.selectedDuration
      )
    }
  }
}
