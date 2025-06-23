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
    name: 'creation Date',
    key: 'creationDate',
    sort: (ideas: IdeaType[]) => {
      return [...ideas].sort((a, b) =>
        compareAsc(a.content.createdAt || new Date(0), b.content.createdAt || new Date(0)),
      );
    },
  },
};
