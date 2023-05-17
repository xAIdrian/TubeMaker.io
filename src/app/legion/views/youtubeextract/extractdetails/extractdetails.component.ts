import { AfterContentInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild, AfterViewInit, ViewChildren } from "@angular/core";

import { FormGroup } from "@angular/forms";
import { ExtractDetailsService } from "../extractdetails.service";
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute, ParamMap } from "@angular/router";
import { YoutubeVideoPage } from "src/app/legion/model/youtubevideopage.model";

@Component({
    selector: 'extract-details',
    templateUrl: './extractdetails.component.html',
    styleUrls: ['./extractdetails.component.scss'],
    changeDetection: ChangeDetectionStrategy.Default
})
export class ExtractDetailsComponent implements OnInit, AfterContentInit {

    isKickbackVisible = false;
    kickbackText = 'Are you sure you want to return to the home page?';

    transcriptIsLoading = true;
    isErrorVisible = false;
    errorText = '';

    scriptFormGroup: FormGroup;
    isLinear: any;
    videoEmbedUrl: SafeResourceUrl;

    //output observable for all of our ViewChilds
    currentPageId: string;

    constructor(
        private extractDetailsService: ExtractDetailsService,
        private sanitizer: DomSanitizer,
        private activatedRoute: ActivatedRoute, 
        private changeDetectorRef: ChangeDetectorRef
    ) { /** */ }
    
    ngOnInit(): void {
        let pathId: string = '';
        // if (localStorage.getItem('detailsId') !== null && localStorage.getItem('detailsId') !== '') {
        //     console.log("🚀 ~ file: extractdetails.component.ts:47 ~ ExtractDetailsComponent ~ ngOnInit ~ localStorage.getItem('detailsId'):", localStorage.getItem('detailsId'))
        //     pathId = localStorage.getItem('detailsId')!!;
        // } 
        this.activatedRoute.paramMap.subscribe((params: ParamMap) => {
            console.log("🚀 ~ file: extractdetails.component.ts:49 ~ ExtractDetailsComponent ~ this.activatedRoute.paramMap.subscribe ~ params:", params)
            if (params.has('id')) {
                pathId = params.get('id')!!;
                this.extractDetailsService.getCurrentPage(pathId).subscribe({
                    next: (page: YoutubeVideoPage) => {
                        console.log("🚀 ~ file: extractdetails.component.ts:62 ~ ExtractDetailsComponent ~ this.extractDetailsService.getCurrentPage ~ page:", page)
                        this.videoEmbedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.extractDetailsService.getCurrentVideoUrl());
                        this.currentPageId = page.id ?? '';
                    },
                    error: (error: any) => {
                        console.log("🚀 ~ file: extractdetails.component.ts:65 ~ ExtractDetailsComponent ~ this.extractDetailsService.getCurrentPage ~ error:", error)
                        this.isErrorVisible = true;
                        this.errorText = error;
                    }
                });
            } else {
                this.currentPageId = '';
                this.videoEmbedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.extractDetailsService.getCurrentVideoUrl());
            }
        });

        this.setupObservers();
        this.setupFormControls();
    }
    
    ngAfterContentInit(): void {
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

    isCurrentVideoPresent() {
        return this.extractDetailsService.isCurrentVideoPresent();
    }

    private setupFormControls() {
        this.scriptFormGroup = new FormGroup({});
    }
}
