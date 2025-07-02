import { compareAsc } from 'date-fns';
import type { IdeaType } from '../../types';

type FilterNames = 'alphabetically' | 'creationDate' | '';

type SortApi = Record<
  string,
  {
    key: FilterNames;
    sort: (ideas: IdeaType[]) => IdeaType[];
  }
>;

export const sortApi: SortApi = {
  alphabetically: {
    key: 'alphabetically',
    sort: (ideas: IdeaType[]) => {
      return [...ideas].sort((a, b) => a.content.title.localeCompare(b.content.title));
    },
  },
  creationDate: {
    key: 'creationDate',
    sort: (ideas: IdeaType[]) => {
      return [...ideas].sort((a, b) => compareAsc(a.content.createdAt, b.content.createdAt));
    },
  },
};
