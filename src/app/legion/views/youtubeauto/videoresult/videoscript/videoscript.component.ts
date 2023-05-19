import { AfterContentInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnChanges, SimpleChanges } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { DurationSection, VideoDuration } from "../../../../model/autocreate/videoduration.model";
import { VideoDetailsService } from "../../videodetails.service";
import { AutoContentRepository } from "src/app/legion/repository/content/autocontent.repo";
import { Clipboard } from '@angular/cdk/clipboard';

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
  showScriptBadge = false;

  constructor(
    private contentRepo: AutoContentRepository,
    private clipboard: Clipboard,
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
    if (changes['parentScriptFormGroup']) {
      this.parentScriptFormGroup = changes['parentScriptFormGroup'].currentValue;
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
    this.contentRepo.getCompleteScript().subscribe((script) => {
        this.clipboard.copy(script);
        this.showScriptBadge = true;
        setTimeout(() => (this.showScriptBadge = false), 1000);
      });
  }
}

