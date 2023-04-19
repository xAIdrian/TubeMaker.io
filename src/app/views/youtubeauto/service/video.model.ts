export interface Video {
    id: string;
    title: string;
    description: string;
    publishedAt: string;
    channelTitle: string;
}

export interface VideoFull {
    id: string;
    title: string;
    description: string;
    thumbnail: string;
    publishedAt: string;
    channelTitle: string;
    channelId: string;
    viewCount: string;
    likeCount: string;
    dislikeCount: string;
    favoriteCount: string;
    commentCount: string;
    duration: string;
    tags: string[];
    category: string;
    liveBroadcastContent: string;
    defaultAudioLanguage: string;
    defaultLanguage: string;
    localized: {
        title: string;
        description: string;
    };
    defaultThumbnail: string;
}