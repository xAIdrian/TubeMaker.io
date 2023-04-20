import {
  AfterContentInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { VoiceService } from '../service/voice.service';
import { NavigationService } from '../service/navigation.service';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
} from '@angular/forms';
import { saveAs } from 'file-saver';
import { GptGeneratedVideo } from '../model/gptgeneratedvideo.model';
import { GptService } from '../service/gpt.service';

@Component({
  selector: 'video-result',
  templateUrl: './videoresult.component.html',
  styleUrls: ['./videoresult.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default,
})
export class VideoResultComponent implements OnInit, AfterContentInit {
  gptResponseTitle: string = 'Waiting for title...';
  gptResponseDescription: string = 'Waiting for desc...';
  gptResponseScript: string = 'Waiting for script...';
  gptResponseTags: string = 'Waiting for tags...';

  isLinear: any;
  isLoading: boolean = true;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  thirdFormGroup: FormGroup;

  constructor(
    private gptService: GptService,
    private voiceService: VoiceService,
    private navigationService: NavigationService,
    private _formBuilder: FormBuilder,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.gptService.getPromptResponseObserver().subscribe(
      (response: GptGeneratedVideo) => {
        this.isLoading = false;
        console.log(
          '🚀 ~ file: videoresult.component.ts:40 ~ VideoResultComponent ~ this.posterService.getResultsObserver.subscribe ~ response:',
          response
        );

        this.gptResponseTitle = response.title.trim();
        this.gptResponseDescription = response.description.trim();
        this.gptResponseScript = response.script.trim();
        this.gptResponseTags = response.tags.join(', ').trim();
      }
    );

    this.firstFormGroup = this._formBuilder.group({
      subject: ['', Validators.required],
    });
    this.secondFormGroup = this._formBuilder.group({
      selectedStyle: ['', Validators.required],
      selectedDuration: ['', Validators.required],
    });
    this.thirdFormGroup = this._formBuilder.group({
      selectedVoice: [''],
    });
  }

  ngAfterContentInit(): void {
    this.changeDetectorRef.detectChanges();
    this.gptService.getGptContent();
  }

  onReset() {
    this.navigationService.navigateToCreateVideo();
  }

  downloadTextFile() {
    this.gptService.getScriptForDownload().subscribe((blobItem) => {
      saveAs(blobItem.blob, blobItem.filename);
    });
  }

  onSchedule() {}
}
