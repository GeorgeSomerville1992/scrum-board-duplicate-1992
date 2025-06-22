import { sortApi } from './sortApi';

const options = Object.values(sortApi).map((sort) => {
  const { name, key } = sort;
  return {
    name,
    key,
  };
});

export const Sort = ({ handleIdeasSort }) => {
  return (
    <select onChange={handleIdeasSort} name="sort" id="sort" defaultValue="">
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
