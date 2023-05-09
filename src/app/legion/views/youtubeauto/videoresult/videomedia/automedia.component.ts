import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from "@angular/core";
import { VideoMediaComponent } from "../../../common/videomedia/videomedia.component";
import { TranslateService } from "@ngx-translate/core";
import { NavigationService } from "../../../../service/navigation.service";
import { VoiceService } from "../../../../service/voice.service";
import { AutoContentModel } from "../../../../model/autocontent.model";

@Component({
  selector: 'auto-media',
  templateUrl: '../../../common/videomedia/videomedia.component.html',
  styleUrls: ['../../../common/videomedia/videomedia.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default,
})
export class AutoMediaComponent extends VideoMediaComponent {

  constructor(
    contentRepo: AutoContentModel,
    voiceService: VoiceService,
    navigationService: NavigationService,
    translate: TranslateService,
    changeDetectorRef: ChangeDetectorRef
  ) {
    super(
      contentRepo,
      voiceService,
      navigationService,
      translate,
      changeDetectorRef
    );
  }
 }
