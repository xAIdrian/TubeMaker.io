import { AfterContentInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, OnInit, Output } from "@angular/core";
import { GptService } from "../../service/gpt.service";
import { ContentService } from "../../service/content.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { DurationSection, VideoDuration } from "../../model/videoduration.model";

@Component({
  selector: 'video-script',
  templateUrl: './videoscript.component.html',
  styleUrls: ['./videoscript.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default,
})
export class VideoScriptComponent implements OnInit, AfterContentInit {

  @Output() scriptFormGroupEvent = new EventEmitter<FormGroup>();
  
  public parentIsLoading = false;

  isScriptLoading: boolean = false;
  scriptFormGroup: FormGroup;

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
    private _formBuilder: FormBuilder,
    private changeDetectorRef: ChangeDetectorRef,
  ) {
    this.currentVideoDuration = contentService.getCurrentVideoDuration();
  }

  ngOnInit(): void {
    this.setupObservers();
    this.setupFormGroups();
  }

  ngAfterContentInit(): void {
    this.changeDetectorRef.detectChanges();
  }

  setupObservers() {
    /**
     * This needs to be updated to use the new multiple sections that make up our script
     */
    this.gptService.getScriptSubjectObserver().subscribe((response) => {
      this.isScriptLoading = false;
      // this.scriptFormGroup.patchValue({ script: response.trim() })
    });
  }

  setupFormGroups() {
    this.scriptFormGroup = this._formBuilder.group({
      introduction: ['', Validators.required],
      mainContent: ['', Validators.required],
      conclusion: ['', Validators.required],
      questions: [''],
      opinions: [''],
      caseStudies: [''],
      actionables: [''],
    });
  }

  onRerollSection(section: DurationSection) {
    section.isLoading = true;
    const controlName = section.controlName
    this.scriptFormGroup.patchValue({ controlName: 'Please wait...' })
    this.scriptFormGroupEvent.emit(this.scriptFormGroup);
  }

  onOptimizeSection(section: DurationSection) {
    section.isLoading = true;
    const controlName = section.controlName
    this.scriptFormGroup.patchValue({ controlName: 'Optimizing with AI..' })
    this.scriptFormGroupEvent.emit(this.scriptFormGroup);
  }

  rerollScript() {
    this.isScriptLoading = true;
    this.scriptFormGroup.patchValue({ script: 'Please wait...'  })
    this.gptService.getIsolatedScript();
  }

  optimizeScript() {
    let scar = this.currentVideoDuration.sections[0].points[0] + '\n\n';
  }
}

