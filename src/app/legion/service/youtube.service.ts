import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { from, Observable, Observer, of, Subject } from 'rxjs';
import { YoutubeDataRepository } from '../repository/youtubedata.repo';
import { YoutubeVideo } from '../model/video/youtubevideo.model';

declare var gapi: any;

@Injectable({
  providedIn: 'root',
})
export class YoutubeService {

  private tokenSuccessSubject = new Subject<string>();
  private errorSubject = new Subject<string>();
  private youtubeVideosSubject = new Subject<YoutubeVideo[]>();

  constructor(
    private youtubeRepository: YoutubeDataRepository
  ) {}

  requestAccessToken() {
    this.youtubeRepository.getRequestToken().subscribe({ /** */ });
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

  searchYoutubeVideos(niche: string) {
    this.youtubeVideosSubject.next(
      [
        {
          id: 'WqKdr68YjBs',
          title: 'Top 5 Videos De FANTASMAS: Tu TÍO Te Esta Buscando...',
          description: 'Bienvenido a Doc Tops. Desde algo en el bosque hasta un árabe tumbapuertas , estos son 5 fantasmas captados en cámara.',
          thumbnailUrl: 'https://i.ytimg.com/vi/WqKdr68YjBs/hqdefault.jpg',
          publishedAt: '2023-04-23T21:19:04Z',
          channelTitle: 'Doc Tops',
          statistics: {
            viewCount: '2233445',
            likeCount: '87654',
            commentCount: '12000',
          }
        },
        {
          id: 'Zlg--MIhUdc',
          title: 'أبرز 5 جيوش جابوا العيد في نفسهم',
          description: 'شاركونا في التعليقات جيوش نكبت نفسها بنفسها وموعدنا معاكم يتكرر الخميس ٤ / ابريل / ٢٠٢٣م - الساعة ٧م شيك على باقة زين المنزلية ...',
          thumbnailUrl: 'https://i.ytimg.com/vi/Zlg--MIhUdc/hqdefault.jpg',
          publishedAt: '2023-04-27T16:03:56Z',
          channelTitle: 'الأخوين قدس',
          statistics: {
            viewCount: '2233445',
            likeCount: '87654',
            commentCount: '12000',
          }
        },
        {
          id: 'oVbYZw-oFAk',
          title: 'Aadivaaram with Star Maa Parivaaram - Promo | BB Jodi Top 5 Celebrations | Sunday 11 AM | StarMaa',
          description: 'This Sunday, get ready for a journey filled with emotions and hilarious comedy as Aadivaaram With Star Maa Parivaaram features ...',
          thumbnailUrl: 'https://i.ytimg.com/vi/oVbYZw-oFAk/hqdefault.jpg',
          publishedAt: '2023-04-28T12:30:32Z',
          channelTitle: 'Star Maa',
          statistics: {
            viewCount: '2233445',
            likeCount: '87654',
            commentCount: '12000',
          }
        },
        {
          id: '06_5767tFog',
          title: 'Top 10+ Best Upcoming Mobile Phone Launches⚡May 2023',
          description: "Friends, The most awaited video of the month is here - upcoming smartphones. In today's video we are taking a look at all the ...",
          thumbnailUrl: 'https://i.ytimg.com/vi/06_5767tFog/hqdefault.jpg',
          publishedAt: '2023-04-25T06:30:00Z',
          channelTitle: 'Trakin Tech',
          statistics: {
            viewCount: '2233445',
            likeCount: '87654',
            commentCount: '12000',
          }
        },
        {
          id: 'y1VDMcblqTc',
          title: 'Top 5 Best Tech Gadgets Under Rs.1000⚡April 2023',
          description: 'Doston Aaj Ke Video Me Hum Baat Kar Rahe Hain Kuch Tech Gadgets Ke Baare Me Jo Under 1000 Aate Hain. Ye Series Ko ...',
          thumbnailUrl: 'https://i.ytimg.com/vi/y1VDMcblqTc/hqdefault.jpg',
          publishedAt: '2023-04-20T09:02:28Z',
          channelTitle: 'Trakin Tech',
          statistics: {
            viewCount: '2233445',
            likeCount: '87654',
            commentCount: '12000',
          }
        },
        {
          id: 'PbzDWfaQfXI',
          title: 'Stephen’s A-List: Top 5 NBA Playoff performances EVER! 🤯 | First Take',
          description: 'Stephen A. Smith presents his A-List on First Take of the top five all-time NBA Playoff performances. #ESPN #FirstTake ...',
          thumbnailUrl: 'https://i.ytimg.com/vi/PbzDWfaQfXI/hqdefault.jpg',
          publishedAt: '2023-04-25T16:22:36Z',
          channelTitle: 'ESPN',
          statistics: {
            viewCount: '2233445',
            likeCount: '87654',
            commentCount: '12000',
          }
        },
        {
          id: 'QSx6xQpQyyk',
          title: 'Boot licking Competition &amp; Saboot hypocrisy  | Top 5 GODI of the WEEK',
          description: 'For Business inquiries: iamsatyakam@gmail.com Like on Facebook ...',
          thumbnailUrl: 'https://i.ytimg.com/vi/QSx6xQpQyyk/hqdefault.jpg',
          publishedAt: '2023-04-28T06:30:35Z',
          channelTitle: 'Being Honest',
          statistics: {
            viewCount: '2233445',
            likeCount: '87654',
            commentCount: '12000',
          }
        },
        {
          id: 'nIgipHP9zZo',
          title: 'Top 5 Boxeadores INVICTOS DESTRUIDOS por JULIO CÉSAR CHÁVEZ | Historias',
          description: 'Top 5 Boxeadores a quienes JULIO CÉSAR CHÁVEZ DESTRUYÓ su INVICTO | Historias Suscribete a nuestro segundo canal.',
          thumbnailUrl: 'https://i.ytimg.com/vi/nIgipHP9zZo/hqdefault.jpg',
          publishedAt: '2023-04-26T21:00:32Z',
          channelTitle: 'COOLturizate',
          statistics: {
            viewCount: '2233445',
            likeCount: '87654',
            commentCount: '12000',
          }
        },
        {
          id: 'Id-L5wdVQ8c',
          title: '[SFM FNaF] Top 5 Garten of Banban vs FNaF WITH Healthbars #4',
          description: '[SFM FNaF] Top 5 Garten of Banban vs FNaF WITH Healthbars #4 Animated by me Subscribe to Parrot Cinema on YouTube!',
          thumbnailUrl: 'https://i.ytimg.com/vi/Id-L5wdVQ8c/hqdefault.jpg',
          publishedAt: '2023-04-24T13:51:32Z',
          channelTitle: 'Parrot Cinema',
          statistics: {
            viewCount: '2233445',
            likeCount: '87654',
            commentCount: '12000',
          }
        },
        {
          id: 'UspkHGCz7MQ',
          title: 'Blood Bath of GODI &amp; Master stroke | Top 5 GODI of the WEEK',
          description: 'Sign up on Rario and get Rs. 1600 - https://rario.onelink.me/1e6U/honest For Business inquiries: iamsatyakam@gmail.com Like ...',
          thumbnailUrl: 'https://i.ytimg.com/vi/UspkHGCz7MQ/hqdefault.jpg',
          publishedAt: '2023-04-21T04:57:03Z',
          channelTitle: 'Being Honest',
          statistics: {
            viewCount: '2233445',
            likeCount: '87654',
            commentCount: '12000',
          }
        },
        {
          id: '5XnNom5YUk4',
          title: 'Top 5 AI Tools That Are BETTER Than ChatGPT, But Nobody is Using Them | Coding &amp; Productivity Tools',
          description: 'Top 5 AI Tools That Are BETTER Than ChatGPT, But Nobody is Using Them | Coding & Productivity Tools suggests that other ...',
          thumbnailUrl: 'https://i.ytimg.com/vi/5XnNom5YUk4/hqdefault.jpg',
          publishedAt: '2023-04-21T16:02:18Z',
          channelTitle: 'Tiff In Tech',
          statistics: {
            viewCount: '2233445',
            likeCount: '87654',
            commentCount: '12000',
          }
        },
        {
          id: 'ncU-0gjvrP0',
          title: 'Top 5 BIGGEST SCAMS in Pet Simulator X!',
          description: 'Top 5 BIGGEST SCAMS in Pet Simulator X! Discord!!! - https://discord.com/invite/JUFw49VCtF ▷ Roblox Profile ...',
          thumbnailUrl: 'https://i.ytimg.com/vi/ncU-0gjvrP0/hqdefault.jpg',
          publishedAt: '2023-04-30T21:31:10Z',
          channelTitle: 'isight',
          statistics: {
            viewCount: '2233445',
            likeCount: '87654',
            commentCount: '12000',
          }
        },
        {
          id: 'pmy7E3w2t0o',
          title: '5 Devil Fruits So Overpowered, They Might Break One Piece',
          description: 'Check out the link to LootBoy https://lootboy.page.link/Ohara and use the code "ohara" and LootBoy will send you a community ...',
          thumbnailUrl: 'https://i.ytimg.com/vi/pmy7E3w2t0o/hqdefault.jpg',
          publishedAt: '2023-04-29T15:46:34Z',
          channelTitle: 'Ohara',
          statistics: {
            viewCount: '2233445',
            likeCount: '87654',
            commentCount: '12000',
          }
        },
        {
          id: 'juz0IOPg2hk',
          title: 'Our Medal Winners &amp; *PHOTOGENIC | Top 5  of the WEEK',
          description: 'Download Kickcash now to get amazing deals and cashbacks on everytime you shop online ...',
          thumbnailUrl: 'https://i.ytimg.com/vi/juz0IOPg2hk/hqdefault.jpg',
          publishedAt: '2023-04-26T05:53:39Z',
          channelTitle: 'Being Honest',
          statistics: {
            viewCount: '2233445',
            likeCount: '87654',
            commentCount: '12000',
          }
        },
        {
          id: 's_bCmahsa1A',
          title: 'Top 5 Waterproof Motorcycle Gloves of 2023 - Tested',
          description: 'Sure, they might be water resistant, but at what cost? We test 5 cold weather gloves for leaks, and to see how their waterproofing ...',
          thumbnailUrl: 'https://i.ytimg.com/vi/s_bCmahsa1A/hqdefault.jpg',
          publishedAt: '2023-04-22T15:00:37Z',
          channelTitle: 'FortNine',
          statistics: {
            viewCount: '2233445',
            likeCount: '87654',
            commentCount: '12000',
          }
        },
        {
          id: 'F_BccHguYdQ',
          title: 'Canelo Álvarez reacts to his 5 greatest KOs!',
          description: 'Canelo Álvarez reacts to his greatest ever knock outs! Which would you have as number 1? Subscribe to our YouTube channel ...',
          thumbnailUrl: 'https://i.ytimg.com/vi/F_BccHguYdQ/hqdefault.jpg',
          publishedAt: '2023-04-28T13:00:11Z',
          channelTitle: 'DAZN Boxing',
          statistics: {
            viewCount: '2233445',
            likeCount: '87654',
            commentCount: '12000',
          }
        },
        {
          id: 'QvYWCzDm6aM',
          title: 'TOP 5 FAMOUS FOOD IN OLD DELHI😍*Aslam Butter Chicken, Mohabbat Ka Sharbat* EID SPECIAL #QuirkyEats',
          description: 'TOP 5 FAMOUS FOOD IN OLD DELHI! *Aslam Butter Chicken, Mohabbat Ka Sharbat* EID SPECIAL #QuirkyEats ...',
          thumbnailUrl: 'https://i.ytimg.com/vi/QvYWCzDm6aM/hqdefault.jpg',
          publishedAt: '2023-04-21T05:30:06Z',
          channelTitle: 'That Quirky Miss',
          statistics: {
            viewCount: '2233445',
            likeCount: '87654',
            commentCount: '12000',
          }
        },
        {
          id: 'oow-d08eTc8',
          title: 'Wrestlers on Protest &amp; Ab tak 91...  | Top 5 of the WEEK',
          description: 'For Business inquiries: iamsatyakam@gmail.com Like on Facebook ...',
          thumbnailUrl: 'https://i.ytimg.com/vi/oow-d08eTc8/hqdefault.jpg',
          publishedAt: '2023-05-02T04:06:06Z',
          channelTitle: 'Being Honest',
          statistics: {
            viewCount: '2233445',
            likeCount: '87654',
            commentCount: '12000',
          }
        },
        {
          id: 'idc2TKNyheU',
          title: 'Top 5 Netflix Series in 2023 Hindi Dubbed (Part 15)',
          description: 'Complete List for YT Members on https://www.youtube.com/channel/UCPWqbr91cfbtLHZrHM5GItg/join Our Instagram ID: ...',
          thumbnailUrl: 'https://i.ytimg.com/vi/idc2TKNyheU/hqdefault.jpg',
          publishedAt: '2023-04-22T13:30:15Z',
          channelTitle: 'ABHI KA REVIEW',
          statistics: {
            viewCount: '2233445',
            likeCount: '87654',
            commentCount: '12000',
          }
        },
        {
          id: 'aAOHfkl7R54',
          title: 'Top 5 Scary Videos You Should Not Watch Alone',
          description: 'Go to https://dave.com/spooks to sign up for an ExtraCash account and get up to $500 instantly Terms: dave.com/legal ...',
          thumbnailUrl: 'https://i.ytimg.com/vi/aAOHfkl7R54/hqdefault.jpg',
          publishedAt: '2023-04-23T21:00:00Z',
          channelTitle: 'Sir Spooks',
          statistics: {
            viewCount: '2233445',
            likeCount: '87654',
            commentCount: '12000',
          }
        },
        {
          id: '8vG71JpRSGg',
          title: 'Top 5 MotoGP™ Moments | 2023 #SpanishGP 🇪🇸',
          description: 'Action-packed, drama-filled and extremely entertaining: the #SpanishGP had it all! We look back at the top moments from ...',
          thumbnailUrl: 'https://i.ytimg.com/vi/8vG71JpRSGg/hqdefault.jpg',
          publishedAt: '2023-04-30T19:00:03Z',
          channelTitle: 'MotoGP',
          statistics: {
            viewCount: '2233445',
            likeCount: '87654',
            commentCount: '12000',
          }
        },
        {
          id: 'Z-aIK07uWfY',
          title: 'Top 5 - Lifeguards Putting Swimmers Into Place *Watch Party*',
          description: "It's WATCH PARTY time again! Swimmers are not always listening to the warnings. We countdown best moments of lifeguards ...",
          thumbnailUrl: 'https://i.ytimg.com/vi/Z-aIK07uWfY/hqdefault.jpg',
          publishedAt: '2023-04-26T22:00:08Z',
          channelTitle: 'BondiRescue',
          statistics: {
            viewCount: '2233445',
            likeCount: '87654',
            commentCount: '12000',
          }
        },
        {
          id: 'PATuMyJzPG4',
          title: 'AI, Data, Automation &amp; More! The Top 5 Trends from the Media &amp; Entertainment Industry | Salesforce',
          description: 'Learn from Ismael Brown, our Industry Product Marketing Manager, what we discovered in our most recent Media & Entertainment ...',
          thumbnailUrl: 'https://i.ytimg.com/vi/PATuMyJzPG4/hqdefault.jpg',
          publishedAt: '2023-04-25T12:48:04Z',
          channelTitle: 'Salesforce',
          statistics: {
            viewCount: '2233445',
            likeCount: '87654',
            commentCount: '12000',
          }
        },
        {
          id: 'PZPkWS8yVjw',
          title: 'Top 5 guns in COD Mobile Season 4',
          description: 'I stream regularly on Youtube and Trovo: ▷ Trovo - https://trovo.live/bobbyplays Subscribe to more Bobby Plays channels: ...',
          thumbnailUrl: 'https://i.ytimg.com/vi/PZPkWS8yVjw/hqdefault.jpg',
          publishedAt: '2023-04-26T03:32:48Z',
          channelTitle: 'Bobby Plays',
          statistics: {
            viewCount: '2233445',
            likeCount: '87654',
            commentCount: '12000',
          }
        },
        {
          id: 'wuQ-C4zJXTI',
          title: 'Top 5 Pocket Concealed Carry Handguns for 2023',
          description: "In this episode of TFBTV, @JamesReeves is talking POCKET ROCKETS: If you're looking for the perfect pocket carry gun for ...",
          thumbnailUrl: 'https://i.ytimg.com/vi/wuQ-C4zJXTI/hqdefault.jpg',
          publishedAt: '2023-04-30T13:00:43Z',
          channelTitle: 'TFB TV',
          statistics: {
            viewCount: '2233445',
            likeCount: '87654',
            commentCount: '12000',
          }
        }
      ]
    );
    // this.youtubeRepository.getVideoListByNiche(niche).subscribe({
    //   next: (videos) => this.youtubeVideosSubject.next(videos),
    //   error: (err) => this.errorSubject.next(err)
    // });
  }
}
