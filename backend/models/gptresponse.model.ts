export interface GptResponse {
    message: string,
    result: {
        id: string,
        prompt: string;
        title: string;
        description: string;
        script: string;
        tags: string[];
    }
}