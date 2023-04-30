import { AfterContentInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from "@angular/core";
import { GptService } from "../../service/gpt/gpt.service";
import { ContentService } from "../../service/content.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { DurationSection, VideoDuration } from "../../model/create/videoduration.model";

@Component({
  selector: 'video-script',
  templateUrl: './videoscript.component.html',
  styleUrls: ['./videoscript.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default,
})
export class VideoScriptComponent implements AfterContentInit, OnChanges {

  @Input() parentFormGroup: FormGroup;
  
  isScriptLoading: boolean = false;
  liveDemoVisible = false;

  currentVideoDuration: VideoDuration = {
    name: 'please wait',
    header: "",
    description: "",
    sections: [
      {
        name: '',
        controlName: '',
        isLoading: false,
        isOptimizing: false,
        points: []
      }
    ]
  }

  constructor(
    private gptService: GptService,
    private contentService: ContentService,
    private changeDetectorRef: ChangeDetectorRef,
  ) {
    this.currentVideoDuration = contentService.getCurrentVideoDuration();
  }

  /**
   * Where we receive updates from our parent FormControl
   * @param changes 
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes["parentFormGroup"] && this.parentFormGroup) {
      console.log("🚀 ~ file: videoscript.component.ts:45 ~ VideoScriptComponent ~ ngOnChanges ~ parentFormGroup:", this.parentFormGroup)
    }
  }

  ngAfterContentInit(): void {
    this.changeDetectorRef.detectChanges();
  }

  toggleLiveDemo() {
    this.liveDemoVisible = !this.liveDemoVisible;
  }

  handleLiveDemoChange(event: boolean) {
    this.liveDemoVisible = event;
  }

  onRerollSection(section: DurationSection) {
    const controlName = section.controlName
    this.parentFormGroup.patchValue({ controlName: 'Please wait...' })
    this.gptService.getNewScriptSection(section, false)
  }

  // onOptimizeSection(section: DurationSection) {
  //   const controlName = section.controlName
  //   this.gptService.optimizeScriptSection(
  //     section,
  //     this.parentFormGroup.get(section.controlName)?.value
  //   )
  //   this.parentFormGroup.patchValue({ controlName: 'Optimizing with AI..' })
  // }
}

