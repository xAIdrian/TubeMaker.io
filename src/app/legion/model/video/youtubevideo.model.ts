export interface YoutubeVideo {
    id: string;
    title: string;
    description: string;
    thumbnailUrl: string;
    publishedAt: string;
    channelTitle: string;
    statistics: {
        viewCount: string;
        likeCount: string;
        commentCount: string;
        dislikeCount?: string;
        favoriteCount?: string;
    };
    channelId?: string;
    duration?: string;
    tags?: string[];
    category?: string;
    liveBroadcastContent?: string;
    defaultAudioLanguage?: string;
    defaultLanguage?: string;
    localized?: {
        title: string;
        description: string;
    };
    defaultThumbnail?: string;
}