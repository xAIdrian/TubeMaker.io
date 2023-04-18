export interface GptResponse {
    message: string,
    result: {
        id: string,
        prompt: string,
        bulkText: string
    }
}