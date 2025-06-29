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
  handleSort: (sort: keyof typeof sortApi) => void;
  ideas: IdeaType[];
};

export const Sort = ({ handleSort }: SortProps) => {
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    handleSort(event.target.value as keyof typeof sortApi);
  };

  return (
    <select onChange={handleChange} name="sort" id="sort" defaultValue="">
      <option>Sort Ideas by</option>
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
