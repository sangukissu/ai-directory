export interface AIToolCategory {
  name: string;
  slug: string;
}

export interface AITool {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  slug: string;
  aiToolCategories: {
    nodes: AIToolCategory[];
  };
  featuredImage: {
    node: {
      sourceUrl: string;
    };
  };
  affiliateLink?: string;
  modifiedGmt: string;
}

export interface RelatedTool {
  id: string;
  title: string;
  slug: string;
  featuredImage: {
    node: {
      sourceUrl: string;
    };
  };
  aiToolCategories: {
    nodes: AIToolCategory[];
  };
}

