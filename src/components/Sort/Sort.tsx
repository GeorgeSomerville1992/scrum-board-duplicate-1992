import { sortApi } from './sortApi';
import type { IdeaType } from '../../types/index';

const options = Object.values(sortApi).map((sort) => {
  const { name, key } = sort;
  return {
    name,
    key,
  };
});

type SortProps = {
  handleIdeasSort: (sortedIdeas: IdeaType[]) => void;
  ideas: IdeaType[];
}

export const Sort = ({ handleIdeasSort, ideas }: SortProps) => {

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const sortedIdeas = sortApi[event.target.value as keyof typeof sortApi].sort(ideas);
    handleIdeasSort(sortedIdeas);
  };

  return (
    <select onChange={handleChange} name="sort" id="sort" defaultValue="">
      <option value="" disabled hidden>
        Sort
      </option>
      {options.map((option) => {
        return (
          <option key={option.key} value={option.key}>
            {option.name}
          </option>
        );
      })}
    </select>
  );
};
