import {
  AfterContentInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { VideoService } from '../service/video.service';
import { Video } from '../service/video.model';
import { Router } from '@angular/router';

@Component({
  selector: 'video-create',
  templateUrl: './videocreate.component.html',
  styleUrls: ['./videocreate.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default,
})
export class VideoCreateComponent implements OnInit, AfterContentInit {
  promptQuery: any;
  gptResponse: string = "Waiting for response...";

  // private video: Video;

  constructor(
    private router: Router,
    private videoService: VideoService,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.videoService.getPromptResponseObserver().subscribe((response) => {
        console.log(
            '🚀 ~ file: videocreate.component.ts:25 ~ VideoCreateComponent ~ ngOnInit ~ response',
            response
        );
        this.gptResponse = response.bulkText;
    });
  }

  ngAfterContentInit(): void {
    this.changeDetectorRef.detectChanges();
  }

  onSubmit() {
    console.log(
      '🚀 ~ file: videocreate.component.ts:25 ~ VideoCreateComponent ~ ngOnInit ~ this.promptQuery',
      this.promptQuery
    );
    this.videoService.submitPrompt(this.promptQuery);
  }
}
