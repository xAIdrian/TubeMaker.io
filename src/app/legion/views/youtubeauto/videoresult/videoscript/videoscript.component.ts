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
  parentScriptFormGroup: FormGroup;

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
    console.log("🚀 ~ file: videoscript.component.ts:29 ~ VideoScriptComponent ~ currentVideoDuration:", this.currentVideoDuration)
  }

  /**
   * Where we receive updates from our parent FormControl
   * @param changes
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['parentVideoDuration']) {
      this.currentVideoDuration = changes['parentVideoDuration'].currentValue;
    }
  }

  ngAfterContentInit(): void {
    this.changeDetectorRef.detectChanges();
  }

  onImproveClick(prompt: string, section: DurationSection) {
    this.videoDetailsService.updateScriptSection(prompt, section);
  }

  copyScript() {
    this.contentRepo
      .getScriptForDownload('auto-content-file')
      .subscribe((blobItem) => {
        this.clipboard.copy(blobItem);
        this.showScriptBadge = true;
        setTimeout(() => (this.showScriptBadge = false), 1000);
      });
  }
}

