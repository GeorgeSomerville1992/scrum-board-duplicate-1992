import { sortApi } from './sortApi';
import type { IdeaType } from '../../types';

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
      <option value="">Sort Ideas by</option>
      <option key="alphabetically" value="alphabetically">
        Alphabetically
      </option>
      <option key="creationDate" value="creationDate">
        Creation Date
      </option>
    </select>
  );
};
