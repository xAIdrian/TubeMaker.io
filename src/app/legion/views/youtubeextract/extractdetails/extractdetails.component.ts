import { AfterContentInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { YoutubeService } from "../../../service/youtube.service";

@Component({
    selector: 'extract-details',
    templateUrl: './extractdetails.component.html',
    styleUrls: ['./extractdetails.component.scss'],
    changeDetection: ChangeDetectionStrategy.Default
})
export class ExtractDetailsComponent implements OnInit, AfterContentInit {

    transcriptIsLoading = false;
    showErrorState = false;

    transcriptSections: string[] = [];

    scriptFormGroup: FormGroup;

    constructor(
        private youtubeService: YoutubeService,
        private changeDetectorRef: ChangeDetectorRef
    ) { /** */ }
    
    ngOnInit(): void {
        this.setupObservers();
        this.setupFormControls();
    }

    ngAfterContentInit(): void {
        this.changeDetectorRef.detectChanges();
    }

    private setupObservers() {
        this.youtubeService.getVideoTranscriptObserver().subscribe({
            next: (sections) => {
                this.transcriptSections = sections;
            },
            error: (error) => {
                this.showErrorState = true;
            },
            complete: () => {
                this.transcriptIsLoading = false;
                this.changeDetectorRef.detectChanges();
            }
        });
    }

    private setupFormControls() {
        this.scriptFormGroup = new FormGroup({});
    }
}