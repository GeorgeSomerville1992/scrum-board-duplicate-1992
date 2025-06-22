import _ from 'lodash';
import moment from 'moment';
import type { Idea, FilterNames } from '../../types/index';

type SortApi = {
  [key in FilterNames]: {
    name: string;
    key: FilterNames;
    sort: (ideas: Idea[]) => Idea[];
  };
};

export const sortApi: SortApi = {
  alphabetically: {
    name: 'Alphabetically',
    key: 'alphabetically',
    sort: (ideas: Idea[]) => {
      return _.orderBy(ideas, [(idea: Idea) => idea.content.title.toLowerCase()], 'asc');
    },
  },
  creationDate: {
    name: 'creation Date',
    key: 'creationDate',
    sort: (ideas: Idea[]) => {
      return _.orderBy(
        ideas,
        (idea: Idea) => {
          return moment(idea.content.createdAt).valueOf();
        },
        ['asc'],
      );
    },
  },
};
