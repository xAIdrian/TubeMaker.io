import { TranscriptRepository } from './../repository/transcript.repo';
import { Injectable } from '@angular/core';
import { from, Observable, Observer, of, Subject } from 'rxjs';
import { YoutubeDataRepository } from '../repository/youtubedata.repo';
import { YoutubeVideo } from '../model/video/youtubevideo.model';
import { NavigationService } from './navigation.service';
import { TextSplitUtility } from '../helper/textsplit.utility';

declare var gapi: any;

@Injectable({
  providedIn: 'root',
})
export class YoutubeService {
  private errorSubject = new Subject<string>();

  private tokenSuccessSubject = new Subject<string>();
  private youtubeVideosSubject = new Subject<YoutubeVideo[]>();
  private videoTranscriptSubject = new Subject<string[]>();

  private currentCopyCatVideoId = '';

  constructor(
    private youtubeRepository: YoutubeDataRepository,
    private transcriptRepository: TranscriptRepository,
    private navigationService: NavigationService,
    private textSplitter: TextSplitUtility
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

  setCopyCatVideoId(videoId: string) {
    this.currentCopyCatVideoId = videoId;
    this.navigationService.navigateToExtractDetails();
  }

  getVideoTranscript() {
    // if (this.currentCopyCatVideoId === '' || this.currentCopyCatVideoId === undefined) {
    //   this.errorSubject.next('No video selected');
    //   return;
    // }
    
    setTimeout(() => {
      const pars = this.textSplitter.splitIntoParagraphs("Cet épisode est sponsorisé par Ground News, un nouveau site Web et une nouvelle application qui vous permettent de comparer la couverture des événements majeurs. Rendez-vous sur ground.news ou cliquez sur le lien dans la description pour télécharger l'application gratuite. [♪ INTRO…pipe Про Kim Mathilde Il peut être difficile de diagnostiquer la maladie d'Alzheimer. L'attraper tôt peut aider à éviter des symptômes plus graves plus longtemps. Mais c'est encore plus difficile. Les personnes et leurs familles peuvent ne pas remarquer les premiers symptômes ou les attribuer au vieillissement normal. Comment les médecins diagnostiquent la maladie d'Alzheimer Les familles peuvent ne pas s'en apercevoir, certaines choses sont un peu décalées et peuvent être trop effrayées par les implications de ces changements pour en parler à leur famille ou à leur médecin. Et cela sans même entrer dans les autres obstacles à l'accès aux soins de santé. Cela signifie que les personnes atteintes de la maladie d'Alzheimer ne reçoivent souvent pas de traitement ou de soutien dans les premiers stades, ce qui aggrave leur situation à long terme. Le traitement peut retarder la progression de la maladie. Et plus tôt ça commence, mieux c'est. Le truc, c'est que la route vers le diagnostic n'a peut-être pas à ressembler à ça. Et s'il y avait un moyen de détecter les signes de la maladie d'Alzheimer au début de la maladie afin que nous puissions la ralentir dès le début. Eh bien, c'est exactement ce que des chercheurs au Japon ont entrepris de faire. Ils pensent qu'en utilisant l'apprentissage automatique, nous pourrions extraire suffisamment d'informations du discours d'une personne pour identifier les premiers signes de la maladie d'Alzheimer. En effet, la parole est l'une des toutes premières choses à changer chez les personnes atteintes de la maladie d'Alzheimer au stade précoce. Les gens ont tendance à commencer à parler plus lentement et à réfléchir plus souvent, par exemple. Maintenant, pour tester si une approche de diagnostic par apprentissage automatique pourrait fonctionner, l'équipe a recueilli des données audio auprès de participants en bonne santé et de ceux chez qui un médecin avait diagnostiqué la maladie d'Alzheimer. Ils ont collecté un total de 1616 fichiers audio - 1495 de leurs 99 participants témoins et 151 de leurs 24 participants atteints de la maladie d'Alzheimer. Ces enregistrements ont été collectés lors d'un chat participant avec un programme informatique d'IA qui les a accueillis puis leur a demandé de raconter ce qui leur était arrivé la veille avec le plus de détails possible en une minute. Une minute entière de discours peut nous en dire long sur l'état des capacités cognitives d'une personne. La fluidité de leur discours, leur capacité à fournir des détails, etc., peuvent être de très bons indicateurs de leur fonction cognitive globale. C'est l'une des principales raisons pour lesquelles la parole est utilisée dans de nombreux diagnostics actuels de la maladie d'Alzheimer. Les participants ont fait cela tous les jours de la semaine pendant 1 à 2 mois, donnant aux chercheurs une bonne partie des données de chaque participant avec lesquelles travailler. À l'aide d'un logiciel spécialisé, les chercheurs ont ensuite extrait des informations sur la parole des participants à partir de leurs enregistrements. Par exemple, combien de temps ils ont parlé, combien de fois ils ont fait des pauses, ainsi que l'intensité, la hauteur et les caractéristiques générales des sons enregistrés. Toutes ces données ont ensuite été connectées à trois algorithmes différents, qui utilisaient tous des méthodes de calcul légèrement différentes pour catégoriser les données qui leur étaient fournies. Les chercheurs ont alimenté les données des algorithmes à partir de 1 308 fichiers audio pour les former sur les différences entre la parole des personnes atteintes et non atteintes de la maladie d'Alzheimer. Ensuite, ils ont utilisé les données des 308 fichiers restants pour valider leurs capacités prédictives. Une fois ces algorithmes formés, les chercheurs les ont utilisés pour prédire quels audiophiles provenaient de participants atteints de la maladie d'Alzheimer. Ces prédictions ont été comparées aux scores d'une méthode plus traditionnelle de diagnostic de la maladie d'Alzheimer via un test de dépistage appelé l'entretien téléphonique pour l'état cognitif, ou TickS. Les résultats ont montré qu'un algorithme en particulier, l'Extreme Gradient Boosting Model, pourrait mieux identifier la maladie d'Alzheimer que les TickS plus traditionnellement utilisés. L'algorithme rivalisait avec TICS en ne donnant aucun faux négatif, ce qui signifie qu'il n'a manqué aucun cas qui s'y trouvait. Et il a fait mieux que les tiques en ne donnant aucun faux positif – ce qui signifie qu'il n'a pas dit que quelqu'un l'avait alors qu'il ne l'avait pas fait. En fait, environ seize pour cent des participants diagnostiqués via TICS ont été incorrectement classés comme ayant la maladie d'Alzheimer. Ce modèle a pu catégoriser correctement tous les participants, ce qui est une assez grande amélioration. Rappelons que tous les participants du groupe Alzheimer avaient été diagnostiqués par un professionnel, selon différents critères standards. afin que les chercheurs puissent faire ces comparaisons. Mais même avec cette performance, l'algorithme n'était pas significativement meilleur que les tics lorsque des tests statistiques étaient appliqués. Il est important de noter ici que, puisqu'il s'agit encore d'une approche assez nouvelle, même se rapprocher est un résultat prometteur. Nous ne pouvons pas encore tirer de conclusions définitives sur son efficacité, mais avec quelques ajustements, cela pourrait être une technique très importante. Cela dit, comme il est encore tôt pour cette technologie, il y a une tonne de limites à l'étude. Par exemple, les personnes atteintes de la maladie d'Alzheimer peuvent commencer à s'appuyer sur des phrases particulières lorsqu'elles ont du mal à sortir de leur mémoire ce qu'elles aimeraient vraiment dire. Et la fluidité de ces phrases faciles à atteindre pourrait être en mesure de tromper une machine un peu mieux qu'un humain - qui serait beaucoup plus capable de repérer des phrases répétitives ou des changements dans le sujet que cette méthode particulière. L'échantillon de l'étude était également assez petit et basé au Japon, de sorte que la mise en garde de devoir répéter l'étude avec un ensemble de participants plus large et plus diversifié s'applique définitivement. Cette étude particulière a également utilisé des participants qui avaient déjà reçu un diagnostic d'Alzheimer par un humain pour entraîner leurs algorithmes. Et même si c'est génial pour l'entraînement, cela pourrait signifier ou non que cette approche particulière, du moins dans son état actuel, ne pourra pas attraper la maladie d'Alzheimer AVANT qu'un humain ne le puisse, bien que cela puisse éventuellement être possible. Là où cela serait certainement utile, c'est d'attraper la maladie d'Alzheimer chez les personnes ayant un accès limité aux soins de santé. Avec un peu plus de finesse, les chercheurs espèrent-ils être en mesure de développer des outils qui pourraient rendre le diagnostic de la maladie d'Alzheimer plus facilement accessible ? Cela peut ressembler à une application sur votre téléphone, ou même à votre assistant virtuel surveillant les schémas de parole des personnes âgées. Reconnaître la maladie d'Alzheimer à partir de la parole à l'aide de l'intelligence artificielle pourrait aider à poser des diagnostics avant que des symptômes plus graves n'apparaissent. Plus important encore, il pourrait s'agir d'une option peu coûteuse et facilement accessible, qui réduirait certains des obstacles à un traitement et à un soutien rapides, ce qui est une excellente nouvelle pour connecter réellement les traitements aux personnes qui en ont besoin. Cette chaîne traite du cerveau humain et de la manière dont nous interagissons avec le monde. Et la façon dont nous consommons les informations est également une grande partie de la façon dont nous percevons le monde qui nous entoure. Si vous êtes intéressé à voir comment une seule actualité est couverte à travers le spectre politique, vous pourriez être intéressé à consulter GroundNews. GroundNews est un nouveau site Web et une nouvelle application qui vous permettent de comparer la couverture des événements majeurs. C'est un outil utile pour les personnes curieuses qui souhaitent se débarrasser des préjugés des médias et trouver les problèmes les plus importants. Vous pouvez voir tous les aspects de chaque actualité en allant sur Ground.News slash SciShow Psych. Ou vous pouvez cliquer sur le lien dans la description pour télécharger l'application gratuite. [♪ OUTRO ♪ S'IL VOUS PLAÎT ABONNEZ-VOUS ET ACTIVEZ LES NOTIFICATIONS ET LE SON POUR PLUS DE MODS timides ♪♫ - GHOST BLACK skewbadoo! ♪♫")
      this.videoTranscriptSubject.next(pars)
    }, 1000);
    return;

    this.transcriptRepository.getTranscript(this.currentCopyCatVideoId).subscribe({
      next: (response: { message: string, result: { translation: string[] }}) => {
        console.log("🚀 ~ file: youtube.service.ts:108 ~ YoutubeService ~ this.transcriptRepository.getTranscript ~ response:", response)
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
