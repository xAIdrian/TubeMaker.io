export interface VideoStyle {
  name: string;
  header: string;
  description: string;
  channelExamples: {
    name: string;
    url: string;
    subscriptions: string;
    views: string;
    earns: string;
  }[];
}

export const defaultVideoStyles: VideoStyle[] = [
  {
    name: 'Motivation',
    header: 'Motivational Videos',
    description:
      'There is something that everyone can relate to when it comes to motivational videos. You can write your own script or select a compilation of motivational quotes to go with the background music. Motivational talks and videos are viewed by millions every day. They tend to have nice visuals with role models and a deep enthralling voice to convey the message.',
    channelExamples: [
      {
        name: 'Be Inspired',
        subscriptions: '8.4M',
        url: 'https://www.youtube.com/channel/UCaKZDEMDdQc8t6GzFj1_TDw',
        views: '432M',
        earns: '50KUSD/month',
      },
      {
        name: 'Ben Lionel Scott',
        subscriptions: '2.4M',
        url: 'https://www.youtube.com/c/BenLionelScott',
        views: '290M',
        earns: '25KUSD/month',
      },
    ],
  },
  {
    name: 'Top 10',
    header: 'Top 5 / Top 10 Videos',
    description:
      'People love binge-watching the Top5, and Top10 videos. Be it the Top5 best mobile games for kids or the Top10 ways to earn money online. These videos are a perfect mix of education and entertainment. The usual list starts in ascending order to make sure the user watches the entire video anticipating what’s the top item on the list.',
    channelExamples: [
      {
        name: 'Top5Gaming',
        subscriptions: '5.5M',
        url: 'https://www.youtube.com/channel/UCYn6CZe5UGIyPe9WJb0pTrg',
        views: '1.9B',
        earns: '190K USD/month',
      },
      {
        name: 'Top Fives',
        subscriptions: '2.4M',
        url: 'https://www.youtube.com/c/topfives',
        views: '907M',
        earns: '85K USD/month',
      },
      {
        name: 'Top5Central',
        subscriptions: '4.4M',
        url: 'https://www.youtube.com/c/Top5Central',
        views: '720M',
        earns: '4K USD/month',
      },
    ],
  },
  {
    name: 'Hacks',
    header: 'Productivity Hacks',
    description:
      'Everyone around is always trying to get more done in less time. Being efficient is the name of the game, from how to read books faster to getting more quality sleep. These videos will never go out of trend. All you need to do is be clear on the messaging and pain point. Most of these videos can be based on multiple productivity self-help books.',
    channelExamples: [
      {
        name: 'Motivation2Study',
        subscriptions: '3.8M',
        url: 'https://www.youtube.com/c/Motivation2Study',
        views: '260M',
        earns: '21K USD/month',
      },
      {
        name: 'Janice Studies',
        subscriptions: '569K',
        url: 'https://www.youtube.com/c/JaniceStudies',
        views: '64M',
        earns: '5K USD/month',
      },
    ],
  },
  {
    name: 'Scary Stories',
    header: 'Scary Stories',
    description:
      "There is a reason why CreepyPasta has a huge following! It’s true that being scared isn't for everyone but, it is definitely appealing to a specific audience. There is a haunting chill that engrosses people to find out what happens at every dark twist and turn in fate. All you need is a whispering soft voice that can hold the attention of your viewers leading them to want more.",
    channelExamples: [
      {
        name: 'Mr. Nightmare',
        subscriptions: '5.9M',
        url: 'https://www.youtube.com/c/NightmareVids',
        views: '960M',
        earns: '60K USD/month',
      },
      {
        name: 'Be. Busta',
        subscriptions: '756K',
        url: 'https://www.youtube.com/channel/UC-ir6MfYIuyvVJS_DhOhcJw',
        views: '151M',
        earns: '4K USD/month',
      },
      {
        name: 'Blue_Spooky',
        subscriptions: '231K',
        url: 'https://www.youtube.com/c/BlueSpooky',
        views: '39M',
        earns: '3K USD/month',
      },
    ],
  },
  {
    name: 'Cooking',
    header: 'Cooking Videos',
    description:
      'Millions of people watch cooking videos to prepare their meals every day. These videos do not need to involve showing your face, only a good narration of step-by-step instructions following the recipe. Besides recipes, you can also discuss nitty-gritty details like cooking tools, how to organize your refrigerator, and much more.',
    channelExamples: [
      {
        name: '小穎美食',
        subscriptions: '3.6M',
        url: 'https://www.youtube.com/channel/UCJJDD-Hy76jvUMRG-dpFkcw/',
        views: '1.1B',
        earns: '21K USD/month',
      },
      {
        name: 'Lezzetli Tarifler Mutfağı',
        subscriptions: '120K',
        url: 'https://www.youtube.com/c/LezzetliTariflerMutfa%C4%9F%C4%B11',
        views: '16M',
        earns: '3.3K USD/month',
      },
    ],
  },
  {
    name: 'Tutorials',
    header: 'Tutorial Videos',
    description:
      'How do I get started with X? is always a common question. Be it the new design tool you want to use or just the latest social media app. People love to find a walkthrough of the new apps they’re exploring and getting started with. All you need is a little expertise in the field and start recording your screen showing a step-by-step process of getting things done.',
    channelExamples: [
      {
        name: 'Technology for Teachers and Students',
        subscriptions: '1.08M',
        url: 'https://www.youtube.com/c/TechnologyforTeachersandStudents',
        views: '98M',
        earns: '10KUSD/month',
      },
      {
        name: 'The Teacher',
        subscriptions: '175K',
        url: 'https://www.youtube.com/c/TheTeacher',
        views: '31M',
        earns: '1.1K USD/month',
      },
    ],
  },
  {
    name: 'Gaming',
    header: 'Video Game Reviews and Walkthroughs',
    description:
      'A major boom occurred in E-Sports and online gaming during the pandemic. You can easily stream the games you play adding commentary and bringing out your personality. If you don’t think you play so well, you can also add commentary and review the top plays of the week. Make sure you have prior approval from the original streamers before you go ahead and use their clips.',
    channelExamples: [
      {
        name: 'Levinho',
        subscriptions: '11M',
        url: 'https://www.youtube.com/c/Levinho',
        views: '2B',
        earns: '53kUSD/month',
      },
      {
        name: 'Tacaz Gaming',
        subscriptions: '6.96M',
        url: 'https://www.youtube.com/c/Tacaz',
        views: '1.1B',
        earns: '1kUSD/month',
      },
    ],
  },
  {
    name: 'Teach Language',
    header: 'Language Learning Videos',
    description:
      'Use AI to create lessons and translate foreign langugages. Millions of users tune in every day to learn new languages. This could start off with basic phrases, pronunciation, words, and grammar. Lessons can be bite-sized 2-5 mins clips. To take it a little more outside the box body language is also technically a language.',
    channelExamples: [
      {
        name: 'Daily English Conversation',
        subscriptions: '2.88M',
        url: 'https://www.youtube.com/c/DailyEnglishConversationTV',
        views: '136M',
        earns: '8KUSD/month',
      },
      {
        name: 'Sparkle English',
        subscriptions: '35K',
        url: 'https://www.youtube.com/c/SparkleEnglish',
        views: '16M',
        earns: '1KUSD/month',
      },
    ],
  },
  {
    name: 'Bedtime Stories',
    header: 'Bedtime Stories',
    description:
      'Sleepless nights are increasingly common among a large number of people. To help with this, people are eagerly listening to bedtime stories, be it for adults or kids. The beauty of a faceless YouTube channel is that you can gently lull your listeners to sleep if you have a lingering voice.',
    channelExamples: [
      {
        name: 'relax for a while',
        subscriptions: '210K',
        url: 'https://www.youtube.com/c/relaxforawhile',
        views: '19M',
        earns: '1KUSD/month',
      },
      {
        name: 'Soothing Pod - Sleep Meditation & Bedtime Stories',
        subscriptions: '50K',
        url: 'https://www.youtube.com/c/SoothingPod',
        views: '5M',
        earns: '4KUSD/month',
      },
    ],
  },
  {
    name: 'Music',
    header: 'Relaxing / Study Music',
    description:
      'If you’ve got a musical itch, then this one might be the perfect candidate. A large number of users listen to music without lyrics while studying, working, or meditating. Lofi Girl is a perfect example of how a cult of followers can grow with a faceless channel with one of the highest numbers of views. If you’re looking to create your own Music using AI tech, we recommend you check out Boomy.',
    channelExamples: [
      {
        name: 'Lofi Girl',
        subscriptions: '11.4M',
        url: 'https://www.youtube.com/c/LofiGirl',
        views: '1.34B',
        earns: '116KUSD/month',
      },
      {
        name: 'Quiet Quest - Study Music',
        subscriptions: '400K',
        url: 'https://www.youtube.com/c/QuietQuestStudyMusic',
        views: '140M',
        earns: '20KUSD/month',
      },
    ],
  },
];
