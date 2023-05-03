export interface YoutubeVideo {
    id: string;
    title: string;
    description: string;
    thumbnail: string;
    publishedAt: string;
    channelTitle: string;
    viewCount: string;
    likeCount: string;
    dislikeCount: string;
    favoriteCount: string;
    commentCount: string;
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