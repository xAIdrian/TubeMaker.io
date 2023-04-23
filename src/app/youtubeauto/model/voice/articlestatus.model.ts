export interface ArticleStatus {
    voice: string;
    converted: boolean;
    audioDuration: number;
    audioUrl: string;
    message: string;
    error: boolean;
    errorMessage: string;
  }