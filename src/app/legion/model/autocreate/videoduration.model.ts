import { TranslateService } from '@ngx-translate/core';

export interface VideoDuration {
  name: string;
  header: string;
  description: string;
  sections: DurationSection[];
}

export interface DurationSection {
  name: string;
  controlName: string;
  points: string[];
  isLoading?: boolean;
}

export function getDefaultVideoDurations(
  translate: TranslateService
): VideoDuration[] {
  return [
    {
      name: translate.instant('video_duration.very_short'),
      header: translate.instant('video_duration.very_short_header'),
      description: translate.instant('video_duration.very_short_description'),
      sections: [
        {
          name: translate.instant('video_duration.introduction'),
          controlName: 'introduction',
          points: [translate.instant('video_duration.attention_grabbing_hook')],
        },
        {
          name: translate.instant('video_duration.main_content'),
          controlName: 'mainContent',
          points: [translate.instant('video_duration.brief_introduction')],
        },
        {
          name: translate.instant('video_duration.conclusion'),
          controlName: 'conclusion',
          points: [translate.instant('video_duration.call_to_action')],
        },
      ],
    },
    {
      name: translate.instant('video_duration.short'),
      header: translate.instant('video_duration.short_header'),
      description: translate.instant('video_duration.short_description'),
      sections: [
        {
          name: translate.instant('video_duration.introduction'),
          controlName: 'introduction',
          points: [
            translate.instant('video_duration.attention_grabbing_hook'),
            translate.instant('video_duration.brief_introduction'),
          ],
        },
        {
          name: translate.instant('video_duration.main_content'),
          controlName: 'mainContent',
          points: [
            translate.instant('video_duration.concise_explanation'),
            translate.instant('video_duration.deliver_context'),
            translate.instant('video_duration.highlight_key_steps'),
          ],
        },
        {
          name: translate.instant('video_duration.conclusion'),
          controlName: 'conclusion',
          points: [
            translate.instant('video_duration.summarize'),
            translate.instant('video_duration.call_to_action'),
          ],
        },
      ],
    },
    {
      name: translate.instant('video_duration.medium'),
      header: translate.instant('video_duration.medium_header'),
      description: translate.instant('video_duration.medium_description'),
      sections: [
        {
          name: translate.instant('video_duration.introduction'),
          controlName: 'introduction',
          points: [
            translate.instant('video_duration.attention_grabbing_hook'),
            translate.instant('video_duration.brief_introduction'),
          ],
        },
        {
          name: translate.instant('video_duration.main_content'),
          controlName: 'mainContent',
          points: [
            translate.instant('video_duration.concise_explanation'),
            translate.instant('video_duration.use_examples'),
            translate.instant('video_duration.organize_subtext'),
          ],
        },
        {
          name: translate.instant('video_duration.actionable_takeaway'),
          controlName: 'actionables',
          points: [translate.instant('video_duration.practical_tip')],
        },
        {
          name: translate.instant('video_duration.conclusion'),
          controlName: 'conclusion',
          points: [
            translate.instant('video_duration.summarize'),
            translate.instant('video_duration.call_to_action'),
          ],
        },
      ],
    },
    {
      name: translate.instant('video_duration.long'),
      header: translate.instant('video_duration.long_header'),
      description: translate.instant('video_duration.long_description'),
      sections: [
        {
          name: translate.instant('video_duration.introduction'),
          controlName: 'introduction',
          points: [
            translate.instant('video_duration.attention_grabbing_hook'),
            translate.instant('video_duration.brief_introduction'),
            translate.instant('video_duration.preview_key_points'),
          ],
        },
        {
          name: translate.instant('video_duration.main_content'),
          controlName: 'mainContent',
          points: [
            translate.instant('video_duration.in_depth_explanation'),
            translate.instant('video_duration.multiple_examples'),
            translate.instant('video_duration.organize_subtext'),
            translate.instant('video_duration.practical_tip'),
          ],
        },
        {
          name: translate.instant('video_duration.case_studies'),
          controlName: 'caseStudies',
          points: [
            translate.instant('video_duration.relevant_cases'),
            translate.instant('video_duration.relevant_application'),
          ],
        },
        {
          name: translate.instant('video_duration.questions'),
          controlName: 'questions',
          points: [
            translate.instant('video_duration.address_questions'),
            translate.instant('video_duration.clairfy'),
          ],
        },
        {
          name: translate.instant('video_duration.conclusion'),
          controlName: 'conclusion',
          points: [
            translate.instant('video_duration.summarize'),
            translate.instant('video_duration.takeaway'),
            translate.instant('video_duration.call_to_action'),
          ],
        },
      ],
    },
  ];
}
