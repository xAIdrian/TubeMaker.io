import { AfterContentInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from "@angular/core";
import { GptService } from "../../service/gpt/gpt.service";
import { ContentService } from "../../service/content.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { DurationSection, VideoDuration } from "../../model/create/videoduration.model";
import { VoiceService } from "../../service/voice.service";

@Component({
  selector: 'video-media',
  templateUrl: './videomedia.component.html',
  styleUrls: ['./videomedia.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default,
})
export class VideoMediaComponent implements OnInit, AfterContentInit, OnChanges {

  @Input() parentMediaFormGroup: FormGroup;
  audioFormGroup: FormGroup;
  
  generatedAudioIsVisible = false;
  generatedAudio: string;

  voiceOptions: { name: string, sampleUrl: string }[] = [];
  mediaOptions = ['Video', 'Audio', 'Thumbnail'];
  selectedMediaOption = '';
  

  constructor(
    private contentService: ContentService,
    private voiceService: VoiceService,
    private changeDetectorRef: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
    this.voiceService.getVoiceOptionsObserver().subscribe((response) => {
      this.voiceOptions = response;
    });
    this.voiceService.getTextToSpeechObserver().subscribe((response) => {
      if (response !== '') {
        this.generatedAudio = response;
        this.generatedAudioIsVisible = true;
      }
    });
  }

  /**
   * Where we receive updates from our parent FormControl
   * @param changes 
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes["parentMediaFormGroup"] && this.parentMediaFormGroup) {
      console.log("🚀 ~ file: videoscript.component.ts:45 ~ VideoScriptComponent ~ ngOnChanges ~ parentFormGroup:", this.parentMediaFormGroup)
      this.parentMediaFormGroup.get('selectedMedia')?.valueChanges.subscribe((value: string) => {
        this.selectedMediaOption = value;
      });
      this.parentMediaFormGroup.get('selectedVoice')?.valueChanges.subscribe((value: string) => {
        /** */
      });
    }
  }

  ngAfterContentInit(): void {
    this.changeDetectorRef.detectChanges();
  }

  generateTextToSpeech() {
    // const scriptValue = this.resultsFormGroup.get('script')?.value;
    const scriptValue = ''
    if (scriptValue === null || scriptValue === '') {
      alert('Please enter a script before generating audio');
      return;
    }
    
    this.generatedAudio = "";
    this.generatedAudioIsVisible = false;

    const selectedVoiceControl = this.parentMediaFormGroup.get('selectedVoice')?.value;
    this.voiceService.generateTextToSpeech(
      selectedVoiceControl.value, 
      scriptValue
    );
  }

  descriptButtonClicked() {
    ///https://media.play.ht/full_-NTbzfZeyW_-qJQLq4Wg.mp3?generation=1682150707643372&alt=media
    window.open('https://web.descript.com/', '_blank');
  }

  onMediaOptionSelected(option: string) {
    this.selectedMediaOption = option
  }
  goToReview() {
    throw new Error('Method not implemented.');
  }
}

