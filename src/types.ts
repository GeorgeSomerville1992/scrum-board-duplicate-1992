export type IdeaType = {
  id: number;
  content: {
    title: string;
    description: string;
    createdAt: string | Date;
    modifiedAt?: string | Date;
  };
};
