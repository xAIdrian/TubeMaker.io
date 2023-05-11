export interface StructuredScript {
  parentId: string;

  introduction: string;
  mainContent: string;
  conclusion: string;
  questions?: string;
  opinions?: string;
  caseStudies?: string;
  actionables?: string;
}