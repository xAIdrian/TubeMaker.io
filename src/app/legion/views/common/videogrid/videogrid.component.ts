import {
  ChangeDetectionStrategy,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import {
  Component,
  OnInit,
  AfterContentInit,
  ChangeDetectorRef,
} from '@angular/core';
import { YoutubeVideo } from 'src/app/legion/model/video/youtubevideo.model';
import { ExtractDetailsService } from '../../youtubeextract/extractdetails.service';

@Component({
  selector: 'video-grid',
  templateUrl: './videogrid.component.html',
  styleUrls: ['./videogrid.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default,
})
export class VideoGridComponent implements OnChanges, AfterContentInit {
  @Input() parentVideos: YoutubeVideo[] = [];
  @Output() itemSelectEvent = new EventEmitter<YoutubeVideo>();
  @Output() itemDeletedEvent = new EventEmitter<YoutubeVideo>();

  isLoading: boolean = false;
  videos: YoutubeVideo[] = [];

  constructor(private changeDetectorRef: ChangeDetectorRef) {
    /** */
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log(changes);
    if (changes['parentVideos']) {
      // Perform any additional logic or update the view as needed
      this.parentVideos = changes['parentVideos'].currentValue;
    }
  }

  ngAfterContentInit() {
    this.videos = this.parentVideos;
    this.changeDetectorRef.detectChanges();
  }

  onVideoClick(video: YoutubeVideo) {
    this.itemSelectEvent.emit(video);
  }

  onDeleteClick(video: YoutubeVideo) {
    this.itemDeletedEvent.emit(video);
  }
}
