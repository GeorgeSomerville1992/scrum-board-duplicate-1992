export type IdeaType = {
  id: number;
  content: {
    title: string;
    description: string;
    createdAt: string | Date;
    modifiedAt?: string | Date;
  }
};

export type IdeaText = {
  title: string;
  description: string;
}
