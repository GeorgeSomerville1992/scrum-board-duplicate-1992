import { compareAsc } from 'date-fns';
import type { IdeaType } from '../../types/index';

type FilterNames = 'alphabetically' | 'creationDate';

type SortApi = {
  [key in FilterNames]: {
    name: string;
    key: FilterNames;
    sort: (ideas: IdeaType[]) => IdeaType[];
  };
};

export const sortApi: SortApi = {
  alphabetically: {
    name: 'Alphabetically',
    key: 'alphabetically',
    sort: (ideas: IdeaType[]) => {
      return [...ideas].sort((a, b) => a.content.title.localeCompare(b.content.title));
    },
  },
  creationDate: {
    name: 'Creation date',
    key: 'creationDate',
    sort: (ideas: IdeaType[]) => {
      return [...ideas].sort((a, b) => compareAsc(a.content.createdAt, b.content.createdAt));
    },
  },
};
