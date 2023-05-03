import { AfterContentInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from "@angular/core";
import { GptService } from "../../../../service/gpt.service";
import { AutoContentRepository } from '../../../../model/youtubeauto/autocontent.repo';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { DurationSection, VideoDuration } from "../../../../model/youtubeauto/create/videoduration.model";

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
    private gptService: GptService,
    private contentRepo: AutoContentRepository,
    private changeDetectorRef: ChangeDetectorRef,
  ) {
    this.currentVideoDuration = contentRepo.getCurrentVideoDuration();
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

  onScriptSectionClick() {
    console.log("🚀 ~ file: videoscript.component.ts:44 ~ VideoScriptComponent ~ onScriptSectionClick ~ onScriptSectionClick:", this.parentScriptFormGroup)
    
    this.contentRepo.submitScriptSections(
      this.parentScriptFormGroup.value.introduction,
      this.parentScriptFormGroup.value.mainContent,
      this.parentScriptFormGroup.value.caseStudies,
      this.parentScriptFormGroup.value.opinions,
      this.parentScriptFormGroup.value.actionables,
      this.parentScriptFormGroup.value.conclusion
    )
  }

  // onRerollSection(section: DurationSection) {
  //   const controlName = section.controlName
  //   this.parentScriptFormGroup.patchValue({ controlName: 'Please wait...' })
  //   this.gptService.getNewScriptSection(section, false)
  // }

  // onOptimizeSection(section: DurationSection) {
  //   const controlName = section.controlName
  //   this.gptService.optimizeScriptSection(
  //     section,
  //     this.parentFormGroup.get(section.controlName)?.value
  //   )
  //   this.parentFormGroup.patchValue({ controlName: 'Optimizing with AI..' })
  // }
}

