import { AfterContentInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild, AfterViewInit } from "@angular/core";

import { FormGroup } from "@angular/forms";
import { ExtractDetailsService } from "../extractdetails.service";
import { DomSanitizer } from '@angular/platform-browser';

@Component({
    selector: 'extract-details',
    templateUrl: './extractdetails.component.html',
    styleUrls: ['./extractdetails.component.scss'],
    changeDetection: ChangeDetectionStrategy.Default
})
export class ExtractDetailsComponent implements OnInit, AfterContentInit {

    transcriptIsLoading = true;
    showErrorState = false;
    errorText = '';

    scriptFormGroup: FormGroup;
    isLinear: any;
    videoEmbedUrl = this.sanitizer.bypassSecurityTrustResourceUrl('https://www.youtube.com/embed/xAUJYP8tnRE');

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
        this.extractDetailsService.getTranscriptIsLoadingObserver().subscribe({
            next: (isLoading: boolean) => {
                console.log("🚀 ~ file: extractdetails.component.ts:51 ~ ExtractDetailsComponent ~ this.youtubeService.getTranscriptIsLoadingObserver ~ isLoading:", isLoading)
                this.transcriptIsLoading = isLoading;
            }
        });
    }

    private setupFormControls() {
        this.scriptFormGroup = new FormGroup({});
    }
}