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

  selectedStyleControl: FormControl;
  videoStyles: String[] = [];

  constructor(
    private gptService: GptService,
    private navigationService: NavigationService,
    private _formBuilder: FormBuilder,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.setupValueSubscribers();

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

  setupValueSubscribers() {
    this.gptService.getVideoOptionsObserver().subscribe((response) => {
      console.log(
        '🚀 ~ file: videocreate.component.ts:47 ~ VideoCreateComponent ~ this.videoService.getVideoOptionsObserver ~ response:',
        response
      );
      this.videoStyles = response;
    });
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
