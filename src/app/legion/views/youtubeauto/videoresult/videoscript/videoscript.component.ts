import {
  AfterContentInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import {
  DurationSection,
  VideoDuration,
} from '../../../../model/autocreate/videoduration.model';
import { VideoDetailsService } from '../../videodetails.service';
import { AutoContentRepository } from 'src/app/legion/repository/content/autocontent.repo';
import { Clipboard } from '@angular/cdk/clipboard';

@Component({
  selector: 'video-script',
  templateUrl: './videoscript.component.html',
  styleUrls: ['./videoscript.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default,
})
export class VideoScriptComponent
  implements OnInit, AfterContentInit, OnChanges
{
  @Input() parentScriptFormGroup: FormGroup;

  currentVideoDuration: VideoDuration;
  isScriptLoading: boolean = false;
  showScriptBadge: boolean = false;

  constructor(
    private contentRepo: AutoContentRepository,
    private clipboard: Clipboard,
    private videoDetailsService: VideoDetailsService,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    /** */
  }

  ngOnInit() {
    if (this.videoDetailsService.currentDuration !== undefined) {
      this.currentVideoDuration = this.videoDetailsService.currentDuration;
    } else {
      this.currentVideoDuration = {
        name: 'please wait',
        header: '',
        description: '',
        sections: [
          {
            name: 'please wait',
            controlName: 'introduction',
            isLoading: false,
            points: [],
          },
        ],
      };
    }
  }
  /**
   * Where we receive updates from our parent FormControl
   * @param changes
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['parentScriptFormGroup']) {
      this.parentScriptFormGroup =
        changes['parentScriptFormGroup'].currentValue;
    }
  }

  ngAfterContentInit(): void {
    this.changeDetectorRef.detectChanges();
  }

  onImproveClick(prompt: string, section: DurationSection) {
    this.currentVideoDuration.sections.forEach((section) => {
      this.videoDetailsService.updateScriptSection(prompt, section);
    });
  }

  copyScript() {
    // Get an array of form controls from the form group
    const valauesArray = [];
    const controlsArray = Object.values(this.parentScriptFormGroup.controls);
    for (const control of controlsArray) {
      valauesArray.push(control.value);
    }
    this.clipboard.copy(valauesArray.join('\n'));
    this.showScriptBadge = true;
    setTimeout(() => (this.showScriptBadge = false), 1000);
  }
}
