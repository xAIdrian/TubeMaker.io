import { Injectable } from "@angular/core";
import { GptService } from "../../../service/gpt.service";
import { NavigationService } from "../../../service/navigation.service";
import { YoutubeService } from "../../../service/youtube.service";

@Injectable({
    providedIn: 'root'
})
export class ExtractDetailsService {

  constructor(
    private gptService: GptService,
    private youtubeService: YoutubeService,
    private navigationService: NavigationService,
  ) { /** */ }

}