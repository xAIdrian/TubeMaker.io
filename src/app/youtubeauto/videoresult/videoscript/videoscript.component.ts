import { AfterContentInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from "@angular/core";
import { GptService } from "../../service/gpt/gpt.service";
import { ContentService } from "../../service/content.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { DurationSection, VideoDuration } from "../../model/videoduration.model";

@Component({
  selector: 'video-script',
  templateUrl: './videoscript.component.html',
  styleUrls: ['./videoscript.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default,
})
export class VideoScriptComponent implements OnInit, AfterContentInit, OnChanges {

  @Input() parentFormGroup: FormGroup;
  
  isScriptLoading: boolean = false;

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

  ngOnChanges(changes: SimpleChanges): void {
    console.log("🚀 ~ file: videoscript.component.ts:44 ~ VideoScriptComponent ~ ngOnChanges ~ changes:", changes)
    if (changes["parentFormGroup"] && this.parentFormGroup) {
      console.log("🚀 ~ file: videoscript.component.ts:45 ~ VideoScriptComponent ~ ngOnChanges ~ parentFormGroup:", this.parentFormGroup)
      
    }
  }

  ngOnInit(): void {
    this.setupObservers();
    this.setupFormGroups();
  }

  ngAfterContentInit(): void {
    this.changeDetectorRef.detectChanges();
  }

  setupObservers() {
  }

  setupFormGroups() {
  }

  onRerollSection(section: DurationSection) {
    const controlName = section.controlName
    this.parentFormGroup.patchValue({ controlName: 'Please wait...' })
    this.gptService.getNewScriptSection(section, false)
  }

  onOptimizeSection(section: DurationSection) {
    const controlName = section.controlName
    this.gptService.optimizeScriptSection(
      section,
      this.parentFormGroup.get(section.controlName)?.value
    )
    this.parentFormGroup.patchValue({ controlName: 'Optimizing with AI..' })
  }
}

