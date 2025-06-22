export type IdeaContent = {
  title: string;
  description: string;
  createdAt: string;
  modifiedAt?: string;
};

export type Idea = {
  id: number;
  content: IdeaContent;
};

export type FilterNames = 'alphabetically' | 'creationDate';
