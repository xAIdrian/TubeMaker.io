import { AfterContentInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild, AfterViewInit } from "@angular/core";

import { FormGroup } from "@angular/forms";
import { ExtractDetailsService } from "../extractdetails.service";
import { DomSanitizer } from '@angular/platform-browser';
import { ExtractMediaComponent } from "./videomedia/extractmedia.component";
import { TitleDetailsComponent } from "./titledetails/titledetails.component";
import { ScriptDetailsComponent } from "./scriptdetails/scriptdetails.component";

@Component({
    selector: 'extract-details',
    templateUrl: './extractdetails.component.html',
    styleUrls: ['./extractdetails.component.scss'],
    changeDetection: ChangeDetectionStrategy.Default
})
export class ExtractDetailsComponent implements OnInit, AfterContentInit {

    @ViewChild('extract-media') mediaChild: ExtractMediaComponent
    @ViewChild('title-details') titleChild: TitleDetailsComponent
    @ViewChild('script-details') scriptChild: ScriptDetailsComponent

    hasUnsavedChanges = true;
    liveDemoVisible = false;

    transcriptIsLoading = true;
    showErrorState = false;
    errorText = '';

    scriptFormGroup: FormGroup;
    isLinear: any;
    videoEmbedUrl = this.sanitizer.bypassSecurityTrustResourceUrl('https://www.youtube.com/embed/sRRE3tev-kQ');

    constructor(
        private extractDetailsService: ExtractDetailsService,
        private sanitizer: DomSanitizer,
        private changeDetectorRef: ChangeDetectorRef
    ) { /** */ }
    
    ngOnInit(): void {
        this.setupObservers();
        this.setupFormControls();
        this.videoEmbedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.extractDetailsService.getCurrentVideoUrl());
    }

    ngAfterContentInit(): void {
        this.changeDetectorRef.detectChanges();
    }

    private setupObservers() {
        this.extractDetailsService.getErrorObserver().subscribe({
            next: (error: any) => {
                this.showErrorState = true;
                this.errorText = error;
            },
            complete: () => {
                this.transcriptIsLoading = false;
                this.changeDetectorRef.detectChanges();
            }
        });
        this.extractDetailsService.getKickBackErrorObserver().subscribe({
            next: (error: any) => {
                this.showErrorState = true;
                this.errorText = error;
            },
        });
        this.extractDetailsService.getTranscriptIsLoadingObserver().subscribe({
            next: (isLoading: boolean) => {
                console.log("🚀 ~ file: extractdetails.component.ts:51 ~ ExtractDetailsComponent ~ this.youtubeService.getTranscriptIsLoadingObserver ~ isLoading:", isLoading)
                this.transcriptIsLoading = isLoading;
            }
        });
    }

    onReset() {
        this.extractDetailsService.navigateHome();
    }

    onSave() {
        this.hasUnsavedChanges = true;

        const generatedVoice = this.mediaChild.generatedAudioUrl;
        const title = this.titleChild.titleFormGroup.value.title;
        const description = this.titleChild.titleFormGroup.value.description;
        const tags = this.titleChild.titleFormGroup.value.tags;
        const script = this.scriptChild.transcriptSections.map((uiSection) => {
            return uiSection.section;
        })
        this.extractDetailsService.submitSave(
            generatedVoice,
            title,
            description,
            tags,
            script
        )
    }

    toggleLiveDemo() {
        this.liveDemoVisible = !this.liveDemoVisible;
    }

    confirmToReturn() {
        this.liveDemoVisible = false
        this.extractDetailsService.navigateHome();
    }

    private setupFormControls() {
        this.scriptFormGroup = new FormGroup({});
    }
}
