import { AfterContentInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnChanges, SimpleChanges } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { DurationSection, VideoDuration } from "../../../../model/autocreate/videoduration.model";
import { VideoDetailsService } from "../../videodetails.service";

@Component({
  selector: 'video-script',
  templateUrl: './videoscript.component.html',
  styleUrls: ['./videoscript.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default,
})
export class VideoScriptComponent implements AfterContentInit, OnChanges {

  @Input() parentScriptFormGroup: FormGroup;
  
  isScriptLoading: boolean = false;

  currentVideoDuration: VideoDuration; 

  constructor(
    private videoDetailsService: VideoDetailsService,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    this.currentVideoDuration = videoDetailsService.getCurrentVideoDuration();
  }

  /**
   * Where we receive updates from our parent FormControl
   * @param changes 
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes["parentFormGroup"] && this.parentScriptFormGroup) {
      console.log("🚀 ~ file: videoscript.component.ts:45 ~ VideoScriptComponent ~ ngOnChanges ~ parentFormGroup:", this.parentScriptFormGroup)
    }
  }

  ngAfterContentInit(): void {
    this.changeDetectorRef.detectChanges();
  }

  onImproveClick(prompt: string, section: DurationSection) {
    this.videoDetailsService.updateScriptSection(prompt, section);
  }

}

