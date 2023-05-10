import { TranslateService } from '@ngx-translate/core';

export interface VideoNiche {
  name: string;
  header: string;
  description: string;
  value: string;
}

export function getDefaultVideoNiches(
  translate: TranslateService
): VideoNiche[] {
  return [
    {
      name: translate.instant('video_style.psychology'),
      header: translate.instant('video_style.psychology_header'),
      description: translate.instant('video_style.psychology_description'),
      value: 'psychology',
    },
    {
      name: translate.instant('video_style.story_telling'),
      header: translate.instant('video_style.story_telling_header'),
      description: translate.instant('video_style.story_telling_description'),
      value: 'story telling',
    },
    {
      name: translate.instant('video_style.cooking'),
      header: translate.instant('video_style.cooking_header'),
      description: translate.instant('video_style.cooking_description'),
      value: 'cooking',
    },
    {
      name: translate.instant('video_style.hacks'),
      header: translate.instant('video_style.hacks_header'),
      description: translate.instant('video_style.hacks_description'),
      value: 'hacks',
    },
    {
      name: translate.instant('video_style.movie_recap'),
      header: translate.instant('video_style.movie_recap_header'),
      description: translate.instant('video_style.movie_recap_description'),
      value: 'movie recap',
    },
    {
      name: translate.instant('video_style.language'),
      header: translate.instant('video_style.language_header'),
      description: translate.instant('video_style.language_description'),
      value: 'language',
    },
    {
      name: translate.instant('food_experiments.name'),
      header: translate.instant('food_experiments.header'),
      description: translate.instant('food_experiments.description'),
      value: 'food experiments',
    },
    {
      name: translate.instant('diy_life_hacks.name'),
      header: translate.instant('diy_life_hacks.header'),
      description: translate.instant('diy_life_hacks.description'),
      value: 'diy life hacks',
    },
    {
      name: translate.instant('sustainable_living.name'),
      header: translate.instant('sustainable_living.header'),
      description: translate.instant('sustainable_living.description'),
      value: 'sustainable living',
    },
    {
      name: translate.instant('brain_teasers.name'),
      header: translate.instant('brain_teasers.header'),
      description: translate.instant('brain_teasers.description'),
      value: 'brain teasers',
    },
    {
      name: translate.instant('pet_parenting.name'),
      header: translate.instant('pet_parenting.header'),
      description: translate.instant('pet_parenting.description'),
      value: 'pet parenting',
    },
    {
      name: translate.instant('minimalism.name'),
      header: translate.instant('minimalism.header'),
      description: translate.instant('minimalism.description'),
      value: 'minimalism',
    },
    {
      name: translate.instant('art_history.name'),
      header: translate.instant('art_history.header'),
      description: translate.instant('art_history.description'),
      value: 'art history',
    },
    {
      name: translate.instant('video_style.virtual_reality'),
      header: translate.instant('video_style.virtual_reality_header'),
      description: translate.instant('video_style.virtual_reality_description'),
      value: 'virtual reality',
    },
  ];
}
