export interface GptResponse {
    message: string,
    result: {
        id: string,
        title: string;
        description: string;
        script: string;
        tags: string[];
    }
}