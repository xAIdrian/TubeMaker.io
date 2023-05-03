export interface GptGeneratedMetaData {
    id: string;
    summary: string;
    title: string;
    description: string;
    tags: string[];
}

export interface GptGeneratedScript {
    id: string;
    introduction: string;
    mainContent: string;
    conclusion: string;
    questions?: string;
    opinions?: string;
    caseStudies?: string;
    actionables?: string;
}