import {
  AfterContentInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  OnInit,
  Output,
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

import { GptGeneratedVideo } from '../model/gpt/gptgeneratedvideo.model';
import { GptService } from '../service/gpt.service';

@Component({
  selector: 'video-result',
  templateUrl: './videoresult.component.html',
  styleUrls: ['./videoresult.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default,
})
export class VideoResultComponent implements OnInit, AfterContentInit {

  isLinear: any;
  isLoading: boolean = true;
  // isLoading: boolean = false;

  resultsFormGroup: FormGroup;
  mediaFormGroup: FormGroup;
  uploadFormGroup: FormGroup;

  voiceOptions: { name: string, sampleUrl: string }[] = [];

  gptResponseTitle: string = 'Waiting for title...';
  gptResponseDescription: string = 'Waiting for desc...';
  gptResponseScript: string = 'Waiting for script...';
  gptResponseTags: string = 'Waiting for tags...';

  generatedAudio: string;
  generatedAudioIsVisible = false;

  constructor(
    private gptService: GptService,
    private voiceService: VoiceService,
    private navigationService: NavigationService,
    private _formBuilder: FormBuilder,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.setupObservers();
    this.setupFormGroups();
    
    this.voiceService.getVoiceOptions()
  }

  ngAfterContentInit(): void {
    this.changeDetectorRef.detectChanges();
    // removed for testing purposes
    this.gptService.getGptContent();
  }

  setupObservers() {
    this.gptService.getPromptResponseObserver().subscribe(
      (response: GptGeneratedVideo) => {
        this.isLoading = false;
        console.log(
          '🚀 ~ file: videoresult.component.ts:40 ~ VideoResultComponent ~ this.posterService.getResultsObserver.subscribe ~ response:',
          response
        );
        this.resultsFormGroup.setValue({
          title: response.title.trim(),
          description: response.description.trim(),
          script: response.script.trim(),
          tags: response.tags.join(', ').trim(),
        });
      }
    );
    this.voiceService.getVoiceOptionsObserver().subscribe((response) => {
      console.log(
        '🚀 ~ file: videocreate.component.ts:47 ~ VideoCreateComponent ~ this.videoService.getVideoOptionsObserver ~ response:',
        response
      );
      this.voiceOptions = response;
    });
    this.voiceService.getTextToSpeechObserver().subscribe((response) => {
      if (response !== '') {
        this.generatedAudio = response;
        this.generatedAudioIsVisible = true;
      }
    });
  }

  setupFormGroups() {
    this.resultsFormGroup = this._formBuilder.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      script: ['', Validators.required],
      tags: ['', Validators.required],
    });
    this.mediaFormGroup = this._formBuilder.group({
      selectedVoice: [''],
      audio: [''],
    });
    this.uploadFormGroup = this._formBuilder.group({ /* */ });
  }

  downloadTextFile() {
    this.gptService.getScriptForDownload().subscribe((blobItem) => {
      saveAs(blobItem.blob, blobItem.filename);
    });
  }
  
  onAudioPicked(event: Event) {
    const htmlTarget = (event?.target as HTMLInputElement)
    if (htmlTarget !== null) {
      if (htmlTarget.files !== null && htmlTarget.files.length > 0) {
        const file = htmlTarget.files[0]
        this.mediaFormGroup.patchValue({ audio: file });
        this.voiceService.updateAudioFile(file);
        //use these if we need to use them locally
        // const audio = this.mediaFormGroup.get('audio')
        // audio?.updateValueAndValidity();
      }
    }
  }

  generateTextToSpeech() {
    const scriptValue = this.resultsFormGroup.get('script')?.value;
    if (scriptValue === null || scriptValue === '') {
      alert('Please enter a script before generating audio');
      return;
    }
    this.generatedAudio = "";
    this.generatedAudioIsVisible = false;

    const selectedVoiceControl = this.mediaFormGroup.get('selectedVoice')?.value;
    this.voiceService.generateTextToSpeech(
      selectedVoiceControl.value, 
      scriptValue
    );
  }

  onSchedule() {

  }

  onReset() {
    this.navigationService.navigateToCreateVideo();
  }
}
