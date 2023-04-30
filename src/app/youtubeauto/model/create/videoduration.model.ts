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
  isOptimizing?: boolean;
}

export const defaultVideoDurations: VideoDuration[] = [
  {
    name: 'Very Short',
    header: 'For videos at 1 minute',
    description: 'Ultra-concise format focusing on a single key point, perfect for rapid consumption and easy sharing.',
    sections: [
      {
        name: 'Introduction',
        controlName: 'introduction',
        points: [
          'Quick attention-grabbing hook'
        ],
      },
      {
        name: 'Main Content',
        controlName: 'mainContent',
        points: [
          'Concise explanation of the key point or main idea',
        ],
      },
      {
        name: 'Conclusion',
        controlName: 'conclusion',
        points: [
          'Quick call-to-action (e.g., subscribe, like, or comment)',
        ],
      },
    ],
  },
  {
    name: 'Short',
    header: 'For videos under 5 minutes',
    description: 'Quick, engaging content that\'s easy to consume, ideal for viewers with short attention spans or seeking fast information.',
    sections: [
      {
        name: 'Introduction',
        controlName: 'introduction',
        points: [
          'Attention-grabbing hook',
          'Briefly introduce the topic or problem being addressed',
        ],
      },
      {
        name: 'Main Content',
        controlName: 'mainContent',
        points: [
          'Brief explanation of the topic or problem',
          'Provide necessary context and background information',
          'Highlight key points or steps',
        ],
      },
      {
        name: 'Conclusion',
        controlName: 'conclusion',
        points: [
          'Recap of the main points covered',
          'Call-to-action (e.g., subscribe, like, or comment)',
        ],
      },
    ],
  },
  {
    name: 'Medium',
    header: 'For videos between 5-10 minutes',
    description: 'Provides a balance between depth and brevity, allowing for detailed explanations without overwhelming the audience.',
    sections: [
      {
        name: 'Introduction',
        controlName: 'introduction',
        points: [
          'Attention-grabbing hook',
          'Introduce the topic or problem being addressed',
        ],
      },
      {
        name: 'Main Content',
        controlName: 'mainContent',
        points: [
          'Detailed explanation of the topic or problem',
          'Use examples and evidence to support your points',
          'Break down the content into subtopics or steps, if applicable',
        ],
      },
      {
        name: 'Actionable Takeaway',
        controlName: 'actionables',
        points: [
          'Provide a practical tip or insight that viewers can apply in their own lives',
        ],
      },
      {
        name: 'Conclusion',
        controlName: 'conclusion',
        points: [
          'Recap of the main points and takeaways',
          'Call-to-action (e.g., subscribe, like, or comment)',
        ],
      },
    ],
  },
  {
    name: 'Long',
    header: 'For videos over 10 minutes',
    description: 'Extended format with case studies and FAQs, ideal for deep dives into subjects and addressing common questions.',
    sections: [
      {
        name: 'Introduction',
        controlName: 'introduction',
        points: [
          'Attention-grabbing hook',
          'Introduce the topic or problem being addressed',
          'Provide an overview of the sections to be covered',
        ],
      },
      {
        name: 'Main Content',
        controlName: 'mainContent',
        points: [
          'In-depth exploration of the topic or problem',
          'Multiple examples and evidence to support your points',
          'Break down the content into subtopics or sections',
          'Include actionable takeaways throughout the video',
        ],
      },
      {
        name: 'Case Studies or Real-life Examples',
        controlName: 'caseStudies',
        points: [
          'Present relevant case studies or real-life examples to illustrate your points',
          'Show the practical application of the concepts discussed',
        ],
      },
      {
        name: 'Q&A or Frequently Asked Questions',
        controlName: 'questions',
        points: [
          'Address common questions or misconceptions related to the topic',
          'Clarify any points that might be confusing for viewers',
        ],
      },
      {
        name: 'Conclusion',
        controlName: 'conclusion',
        points: [
          'Summarize the main points covered',
          'Recap the actionable takeaways',
          'Call-to-action (e.g., subscribe, like, or comment)',
        ],
      },
    ],
  },
  {
    name: 'Very Long',
    header: 'For videos at least 20 minutes',
    description: 'Thorough coverage of topics, incorporating expert opinions and interviews, great for educational or informative content.',
    sections: [
      {
        name: 'Introduction',
        controlName: 'introduction',
        points: [
          'Attention-grabbing hook',
          'Introduce the topic or problem being addressed',
          'Provide an overview of the sections to be covered',
        ],
      },
      {
        name: 'Main Content',
        controlName: 'mainContent',
        points: [
          'Comprehensive exploration of the topic or problem',
          'Multiple examples and evidence to support your points',
          'Break down the content into subtopics or sections',
          'Include actionable takeaways throughout the video',
        ],
      },
      {
        name: 'Case Studies or Real-life Examples',
        controlName: 'caseStudies',
        points: [
          'Present relevant case studies or real-life examples to illustrate your points',
          'Show the practical application of the concepts discussed',
        ],
      },
      {
        name: 'Expert Opinions or Interviews',
        controlName: 'opinions',
        points: [
          'Include insights from experts in the field or conduct interviews to provide additional perspectives',
        ],
      },
      {
        name: 'Q&A or Frequently Asked Questions',
        controlName: 'questions',
        points: [
          'Address common questions or misconceptions related to the topic',
          'Clarify any points that might be confusing for viewers',
        ],
      },
      {
        name: 'Conclusion',
        controlName: 'conclusion',
        points: [
          'Summarize the main points covered',
          'Recap the actionable takeaways',
          'Call-to-action (e.g., subscribe, like, or comment)',
        ],
      },
    ],
  },
];
