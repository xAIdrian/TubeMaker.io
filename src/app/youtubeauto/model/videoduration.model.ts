export interface VideoDuration {
  name: string;
  header: string;
  description: string;
  sections: {
    name: string;
    points: string[];
  }[];
}

export const defaultVideoDurations: VideoDuration[] = [
  {
    name: 'Very Short',
    header: 'For videos at 1 minute',
    description: 'Ultra-concise format focusing on a single key point, perfect for rapid consumption and easy sharing.',
    sections: [
      {
        name: 'Introduction',
        points: [
          'Quick attention-grabbing hook',
          'Very briefly introduce the topic or problem being addressed',
        ],
      },
      {
        name: 'Main Content',
        points: [
          'Concise explanation of the key point or main idea',
          'Focus on the most important aspect of the topic',
        ],
      },
      {
        name: 'Conclusion',
        points: [
          'Rapid recap of the main point',
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
        points: [
          'Attention-grabbing hook',
          'Briefly introduce the topic or problem being addressed',
        ],
      },
      {
        name: 'Main Content',
        points: [
          'Brief explanation of the topic or problem',
          'Provide necessary context and background information',
          'Highlight key points or steps',
        ],
      },
      {
        name: 'Conclusion',
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
        points: [
          'Attention-grabbing hook',
          'Introduce the topic or problem being addressed',
        ],
      },
      {
        name: 'Main Content',
        points: [
          'Detailed explanation of the topic or problem',
          'Use examples and evidence to support your points',
          'Break down the content into subtopics or steps, if applicable',
        ],
      },
      {
        name: 'Actionable Takeaway',
        points: [
          'Provide a practical tip or insight that viewers can apply in their own lives',
        ],
      },
      {
        name: 'Conclusion',
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
    description: 'In-depth exploration of topics, suitable for comprehensive coverage and offering actionable takeaways throughout the video.',
    sections: [
      {
        name: 'Introduction',
        points: [
          'Attention-grabbing hook',
          'Introduce the topic or problem being addressed',
        ],
      },
      {
        name: 'Main Content',
        points: [
          'Comprehensive overview of the topic or problem',
          'Multiple examples and evidence to support your points',
          'Break down the content into subtopics or sections',
          'Include actionable takeaways throughout the video',
        ],
      },
      {
        name: 'Conclusion',
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
    header: 'For videos at 20 minutes',
    description: 'Extended format with case studies and FAQs, ideal for deep dives into subjects and addressing common questions.',
    sections: [
      {
        name: 'Introduction',
        points: [
          'Attention-grabbing hook',
          'Introduce the topic or problem being addressed',
          'Provide an overview of the sections to be covered',
        ],
      },
      {
        name: 'Main Content',
        points: [
          'In-depth exploration of the topic or problem',
          'Multiple examples and evidence to support your points',
          'Break down the content into subtopics or sections',
          'Include actionable takeaways throughout the video',
        ],
      },
      {
        name: 'Case Studies or Real-life Examples',
        points: [
          'Present relevant case studies or real-life examples to illustrate your points',
          'Show the practical application of the concepts discussed',
        ],
      },
      {
        name: 'Q&A or Frequently Asked Questions',
        points: [
          'Address common questions or misconceptions related to the topic',
          'Clarify any points that might be confusing for viewers',
        ],
      },
      {
        name: 'Conclusion',
        points: [
          'Summarize the main points covered',
          'Recap the actionable takeaways',
          'Call-to-action (e.g., subscribe, like, or comment)',
        ],
      },
    ],
  },
  {
    name: 'Extended',
    header: 'For videos at 30 minutes',
    description: 'Thorough coverage of topics, incorporating expert opinions and interviews, great for educational or informative content.',
    sections: [
      {
        name: 'Introduction',
        points: [
          'Attention-grabbing hook',
          'Introduce the topic or problem being addressed',
          'Provide an overview of the sections to be covered',
        ],
      },
      {
        name: 'Main Content',
        points: [
          'Comprehensive exploration of the topic or problem',
          'Multiple examples and evidence to support your points',
          'Break down the content into subtopics or sections',
          'Include actionable takeaways throughout the video',
        ],
      },
      {
        name: 'Case Studies or Real-life Examples',
        points: [
          'Present relevant case studies or real-life examples to illustrate your points',
          'Show the practical application of the concepts discussed',
        ],
      },
      {
        name: 'Expert Opinions or Interviews',
        points: [
          'Include insights from experts in the field or conduct interviews to provide additional perspectives',
        ],
      },
      {
        name: 'Q&A or Frequently Asked Questions',
        points: [
          'Address common questions or misconceptions related to the topic',
          'Clarify any points that might be confusing for viewers',
        ],
      },
      {
        name: 'Conclusion',
        points: [
          'Summarize the main points covered',
          'Recap the actionable takeaways',
          'Call-to-action (e.g., subscribe, like, or comment)',
        ],
      },
    ],
  },
];
