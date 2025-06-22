import _ from 'lodash';
import { compareAsc } from "date-fns";
import type { IdeaType, FilterNames } from '../../types/index';

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
      return _.orderBy(ideas, [(idea: IdeaType) => idea.content.title.toLowerCase()], 'asc');
    },
  },
  creationDate: {
    name: 'creation Date',
    key: 'creationDate',
    sort: (ideas: IdeaType[]) => {
      return [...ideas].sort((a, b) => compareAsc(a.content.createdAt, b.content.createdAt));
    },
  },
};
