import { AfterContentInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild, AfterViewInit, ViewChildren } from "@angular/core";

import { FormGroup } from "@angular/forms";
import { YoutubeExtractService } from "../../youtubeextract/youtubeextract.service";
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute, ParamMap } from "@angular/router";
import { YoutubeVideoPage } from "src/app/legion/model/youtubevideopage.model";
import { YoutubeService } from "../../common/youtube.service";

@Component({
    selector: 'details',
    templateUrl: './details.component.html',
    styleUrls: ['./details.component.scss'],
    changeDetection: ChangeDetectionStrategy.Default
})
export class DetailsComponent implements OnInit, AfterContentInit {

    isKickbackVisible = false;
    kickbackText = 'Are you sure you want to return to the home page?';

    transcriptIsLoading = true;
    isErrorVisible = false;
    errorText = '';

    scriptFormGroup: FormGroup;
    isLinear: any;
    videoEmbedUrl: SafeResourceUrl;

    currentPageId: string;

    constructor(
        protected youtubeService: YoutubeService,
        protected sanitizer: DomSanitizer,
        protected activatedRoute: ActivatedRoute, 
        protected changeDetectorRef: ChangeDetectorRef
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
                this.youtubeService.getCurrentPage(pathId).subscribe({
                    next: (page: YoutubeVideoPage) => {
                        console.log("🚀 ~ file: extractdetails.component.ts:62 ~ ExtractDetailsComponent ~ this.extractDetailsService.getCurrentPage ~ page:", page)
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
            }
        });

        this.setupObservers();
        this.setupFormControls();
    }
    
    ngAfterContentInit(): void {
        this.changeDetectorRef.detectChanges();
    }

    private setupObservers() {
        this.youtubeService.getErrorObserver().subscribe({
            next: (error: any) => {
                this.isErrorVisible = true;
                this.errorText = error;
            },
            complete: () => {
                this.transcriptIsLoading = false;
                this.changeDetectorRef.detectChanges();
            }
        });
        this.youtubeService.getKickBackErrorObserver().subscribe({
            next: (message: string) => {
                if (message === '') {
                    this.isKickbackVisible = false;
                } else {
                    this.isKickbackVisible = true;
                    this.kickbackText = message;
                }
            },
        });
        this.youtubeService.getTranscriptIsLoadingObserver().subscribe({
            next: (isLoading: boolean) => {
                console.log("🚀 ~ file: extractdetails.component.ts:51 ~ ExtractDetailsComponent ~ this.youtubeService.getTranscriptIsLoadingObserver ~ isLoading:", isLoading)
                this.transcriptIsLoading = isLoading;
            }
        });
    }

    onReset() {
        this.youtubeService.navigateHome();
    }

    toggleLiveDemo() {
        this.isKickbackVisible = !this.isKickbackVisible;
    }

    private setupFormControls() {
        this.scriptFormGroup = new FormGroup({});
    }
}
