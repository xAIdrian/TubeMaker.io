import { AfterContentInit, ChangeDetectorRef, Component } from "@angular/core";
import { DetailsComponent } from "../../common/details/details.component";
import { YoutubeExtractService } from "../youtubeextract.service";
import { DomSanitizer } from "@angular/platform-browser";
import { ActivatedRoute } from "@angular/router";
import { FormGroup } from "@angular/forms";

@Component({
  selector: 'youtube-extract',
  templateUrl: './extractdetails.component.html',
  styleUrls: ['../../common/details/details.component.scss'],
})
export class ExtractDetailsComponent extends DetailsComponent implements AfterContentInit {

    constructor(
        private extractService: YoutubeExtractService,
        sanitizer: DomSanitizer,
        activatedRoute: ActivatedRoute, 
        changeDetectorRef: ChangeDetectorRef
    ) {
        super(
            extractService,
            sanitizer,
            activatedRoute,
            changeDetectorRef
        );
    }

    override ngAfterContentInit(): void {
        super.ngAfterContentInit();
        this.videoEmbedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.extractService.getCurrentVideoUrl());
    }

    setupFormControls() {
        this.scriptFormGroup = new FormGroup({});
    }

    isCurrentVideoPresent() {
        return this.extractService.isCurrentVideoPresent();
    }
}
