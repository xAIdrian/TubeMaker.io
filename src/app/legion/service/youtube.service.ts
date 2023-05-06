import { TranscriptRepository } from './../repository/transcript.repo';
import { Injectable } from '@angular/core';
import { from, Observable, Observer, of, Subject } from 'rxjs';
import { YoutubeDataRepository } from '../repository/youtubedata.repo';
import { YoutubeVideo } from '../model/video/youtubevideo.model';
import { NavigationService } from './navigation.service';

declare var gapi: any;

@Injectable({
  providedIn: 'root',
})
export class YoutubeService {
  private errorSubject = new Subject<string>();

  private tokenSuccessSubject = new Subject<string>();
  private youtubeVideosSubject = new Subject<YoutubeVideo[]>();
  private videoTranscriptSubject = new Subject<string[]>();

  constructor(
    private youtubeRepository: YoutubeDataRepository,
    private transcriptRepository: TranscriptRepository,
    private navigationService: NavigationService
  ) {}

  requestAccessToken() {
    this.youtubeRepository.getRequestToken().subscribe({
      /** */
    });
  }

  getTokenSuccessObserver(): Observable<string> {
    return this.tokenSuccessSubject.asObservable();
  }

  getErrorObserver(): Observable<string> {
    return this.errorSubject.asObservable();
  }

  getYoutubeVideosObserver(): Observable<YoutubeVideo[]> {
    return this.youtubeVideosSubject.asObservable();
  }

  getVideoTranscriptObserver(): Observable<string[]> {
    return this.videoTranscriptSubject.asObservable();
  }

  searchYoutubeVideos(niche: string) {
    this.youtubeVideosSubject.next([
      {
        id: 'WqKdr68YjBs',
        title: 'Top 5 Videos De FANTASMAS: Tu TÍO Te Esta Buscando...',
        description:
          'Bienvenido a Doc Tops. Desde algo en el bosque hasta un árabe tumbapuertas , estos son 5 fantasmas captados en cámara.',
        thumbnailUrl: 'https://i.ytimg.com/vi/WqKdr68YjBs/hqdefault.jpg',
        publishedAt: '2023-04-23T21:19:04Z',
        channelTitle: 'Doc Tops',
        statistics: {
          viewCount: '2233445',
          likeCount: '87654',
          commentCount: '12000',
        },
      }])
    
    // this.youtubeRepository.getVideoListByNiche(niche).subscribe({
    //   next: (videos) => this.youtubeVideosSubject.next(videos),
    //   error: (err) => this.errorSubject.next(err)
    // });
  }

  getVideoTranscript(videoId: string) {
    if (videoId === '' || videoId === undefined) {
      return;
    }
    this.navigationService.navigateToExtractDetails();
    setTimeout(() => {
      this.videoTranscriptSubject.next([
          "L'industrie des jeux de réflexion est énorme en ce moment. Mots croisés, jeux de nombres, labyrinthes et plus encore… des jeux de réflexion pour aiguiser votre mémoire. Fonctionnent-ils vraiment pour les personnes atteintes de la maladie d'Alzheimer ? Certaines d'entre elles sont basées sur la vraie science qu'en fait, si vous vous engagez dans ces activités, vous pouvez rester plus frais et plus vif pendant une plus longue période. Le grand défi est de faire ce transfert dans toutes les activités réelles en direct. Nous pensons que oui, mais nous n'en sommes pas sûrs. Le directeur du centre de recherche sur la maladie d'Alzheimer de la Mayo Clinic, le Dr Ronald Peterson, dit que ce qu'ils savent avec certitude, c'est que rester actif mentalement, physiquement et socialement peut jouer un rôle pour vous garder plus alerte, plus longtemps. Il y a de plus en plus de preuves que les modifications du mode de vie peuvent affecter votre fonction cognitive à l'avenir. Cela ne signifie pas que les modifications du mode de vie préviendront nécessairement la maladie d'Alzheimer. Alors allez-y et jouez à ces jeux de réflexion, surtout si vous les aimez. Je m'appelle Vivian Williams et pour plus d'informations sur la santé, visitez le réseau d'informations de la Mayo Clinic.",
          "The brain game industry is huge right now. Crosswords, number games, mazes and more… brain games to hone your memory. Do they really work for people with Alzheimer's disease? Some of these are based in real science that in fact, if you engage in these activities you may keep yourself fresher and sharper for a longer period of time. The big challenge is does this transfer into any real live activities. We think so but we don't know for sure. Director of Mayo Clinic's Alzheimer's Disease Research Center, Dr. Ronald Peterson, says what they do know for sure, is that staying active mentally, physically, and socially, may play a role in keeping you sharper, longer. There is increasing evidence now that lifestyle modifications can affect your cognitive function going forward. It doesn't mean that lifestyle modifications will necessarily prevent Alzheimer's disease. So go ahead and play those brain games, especially if you like them. I'm Vivian Williams and for more health news visit the Mayo Clinic news network."
      ])
    }, 1000);
    
    
    return;
    this.transcriptRepository.getTranscript(videoId).subscribe({
      next: (response: { message: string, result: { translation: string[] }}) => {
        if (response.message !== 'success') {
          this.errorSubject.next(response.message);
          return
        } else if (response.result.translation.length === 0) {
          this.errorSubject.next('No transcript found');
          return;
        }
        this.videoTranscriptSubject.next(response.result.translation);
      },
      error: (err) => {
        console.log(err);
        this.errorSubject.next(err);
      },
    });
  }
}
