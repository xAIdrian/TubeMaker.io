import { AfterContentInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild, AfterViewInit, ViewChildren } from "@angular/core";

import { FormGroup } from "@angular/forms";
import { ExtractDetailsService } from "../extractdetails.service";
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ExtractMediaComponent } from "./videomedia/extractmedia.component";
import { TitleDetailsComponent } from "./titledetails/titledetails.component";
import { ScriptDetailsComponent } from "./scriptdetails/scriptdetails.component";
import { Observable, endWith, filter, flatMap, interval, of, takeUntil, takeWhile, timer } from "rxjs";
import { VideoMediaComponent } from "../../common/videomedia/videomedia.component";

@Component({
    selector: 'extract-details',
    templateUrl: './extractdetails.component.html',
    styleUrls: ['./extractdetails.component.scss'],
    changeDetection: ChangeDetectionStrategy.Default
})
export class ExtractDetailsComponent implements OnInit, AfterContentInit, AfterViewInit {

    hasUnsavedChanges = true;

    isKickbackVisible = false;
    kickbackText = 'Are you sure you want to return to the home page?';

    transcriptIsLoading = true;
    isErrorVisible = false;
    errorText = '';

    scriptFormGroup: FormGroup;
    isLinear: any;
    videoEmbedUrl: SafeResourceUrl;

    constructor(
        private extractDetailsService: ExtractDetailsService,
        private sanitizer: DomSanitizer,
        private changeDetectorRef: ChangeDetectorRef
    ) { /** */ }
    
    ngOnInit(): void {
        this.setupObservers();
        this.setupFormControls();
    }
    
    ngAfterContentInit(): void {
        this.changeDetectorRef.detectChanges();
    }
    
    ngAfterViewInit(): void {
        this.videoEmbedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.extractDetailsService.getCurrentVideoUrl());
        this.changeDetectorRef.detectChanges();
    }

    private setupObservers() {
        this.extractDetailsService.getErrorObserver().subscribe({
            next: (error: any) => {
                this.isErrorVisible = true;
                this.errorText = error;
            },
            complete: () => {
                this.transcriptIsLoading = false;
                this.changeDetectorRef.detectChanges();
            }
        });
        this.extractDetailsService.getKickBackErrorObserver().subscribe({
            next: (message: string) => {
                if (message === '') {
                    this.isKickbackVisible = false;
                } else {
                    this.isKickbackVisible = true;
                    this.kickbackText = message;
                }
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

    toggleLiveDemo() {
        this.isKickbackVisible = !this.isKickbackVisible;
    }

    confirmToReturn() {
        this.hasUnsavedChanges = false;
        this.isKickbackVisible = false
        this.extractDetailsService.navigateHome();
    }

    private setupFormControls() {
        this.scriptFormGroup = new FormGroup({});
    }
}
