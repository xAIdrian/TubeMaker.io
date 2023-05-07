import { TranslateService } from '@ngx-translate/core';

export interface VideoNiche {
  name: string;
  header: string;
  description: string;
}

export function getDefaultVideoNiches(
  translate: TranslateService
): VideoNiche[] {
  return [
    {
      name: translate.instant('video_style.top_5'),
      header: translate.instant('video_style.top_5_header'),
      description: translate.instant('video_style.top_5_description'),
    },
    {
      name: translate.instant('video_style.tech'),
      header: translate.instant('video_style.tech_header'),
      description: translate.instant('video_style.tech_description'),
    },
    {
      name: translate.instant('video_style.story_telling'),
      header: translate.instant('video_style.story_telling_header'),
      description: translate.instant('video_style.story_telling_description'),
    },
    {
      name: translate.instant('video_style.cooking'),
      header: translate.instant('video_style.cooking_header'),
      description: translate.instant('video_style.cooking_description'),
    },
    {
      name: translate.instant('video_style.hacks'),
      header: translate.instant('video_style.hacks_header'),
      description: translate.instant('video_style.hacks_description'),
    },
    {
      name: translate.instant('video_style.movie_recap'),
      header: translate.instant('video_style.movie_recap_header'),
      description: translate.instant('video_style.movie_recap_description'),
    },
    {
      name: translate.instant('video_style.language'),
      header: translate.instant('video_style.language_header'),
      description: translate.instant('video_style.language_description'),
    },
  ];
}
