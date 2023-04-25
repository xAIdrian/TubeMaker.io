import {
  AfterContentInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { GptService } from '../service/gpt.service';
import { Router } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
} from '@angular/forms';
import { NavigationService } from '../service/navigation.service';
import { MediaService } from '../service/media.service';

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
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  thirdFormGroup: FormGroup;

  videoStyles: { name: string, header: string, description: string }[] = [];
  selectedVideoOption: { name: string, header: string, description: string };
  durationOptions: { name: string, header: string, description: string }[] = [];
  selectedDurationOption: { name: string, header: string, description: string };
  
  topicLoading: boolean = false;

  constructor(
    private gptService: GptService,
    private mediaService: MediaService,
    private navigationService: NavigationService,
    private _formBuilder: FormBuilder,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.setupObservers();

    this.selectedVideoOption = { 
      name: '',
      header: 'Select The Style For Your Video',
      description: 'Each video needs a specific style and tone to present the information.  It needs to be captivating and engaging.  Remember to align the style of your video with proven trends in your selected niche'
    }
    this.selectedDurationOption = { 
      name: '',
      header: 'Select The Duration For Your Video',
      description: 'Each video needs a specific duration present the information.  It needs to be captivating and engaging.  Remember to align the style of your video with proven trends in your selected niche'
    }

    this.firstFormGroup = this._formBuilder.group({
      subject: ['', Validators.required],
    });
    this.secondFormGroup = this._formBuilder.group({
      selectedStyle: ['', Validators.required],
    });
    this.thirdFormGroup = this._formBuilder.group({
      selectedDuration: ['', Validators.required]
    });
  }

  ngAfterContentInit(): void {
    this.changeDetectorRef.detectChanges();
  }

  setupObservers() {
    this.gptService.getTopicSubjectObserver().subscribe((response) => {
      this.topicLoading = false;
      this.firstFormGroup.setValue({
        subject: response.replace('"', '').trim()
      })
    });
    this.mediaService.getVideoOptionsObserver().subscribe((response) => {
      this.videoStyles = response;
    });
    this.mediaService.getDurationOptionsObserver().subscribe((response) => {
      this.durationOptions = response;
    });
  }

  reRollTopic() { 
    this.topicLoading = true;
    this.gptService.getIsolatedTopic() 
  }

  onVideoOptionSelected(option: { name: string; header: string; description: string; }) {
    this.selectedVideoOption = option;
  }

  onVideoDurationSelected(option: { name: string; header: string; description: string; }) {
    this.selectedDurationOption = option;
  }

  onSubmit() {
    this.gptService.submitInputs(
        this.firstFormGroup.value.subject,
        this.secondFormGroup.value.selectedStyle,
        this.thirdFormGroup.value.selectedDuration
    );
    this.navigationService.navigateToResults();
  }
}
