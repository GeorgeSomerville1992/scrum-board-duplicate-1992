import { Tile } from '../components/Tile/Tile';
import { sortApi } from '../components/Sort/sortApi';
import type { Idea, IdeaContent } from '../types/index';
import { Sort } from '../components/Sort/Sort';
import { useStorage } from '../hooks/useStorage';

export const Home = () => {
  const defaultIdea = {
    id: 1,
    content: {
      title: '',
      description: '',
      createdAt: '',
      modifiedAt: '',
    },
  };

  const [ideas, setIdeas] = useStorage('ideas', []);

  const handleIdeasSort = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const sortedIdeas = sortApi[event.target.value as keyof typeof sortApi].sort(ideas);
    setIdeas(sortedIdeas);
  };

  const handleCreate = (id: number, idea: IdeaContent) => {
    const newIdea = {
      id: ideas.length + 1,
      content: idea,
    };

    setIdeas(() => {
      return [...ideas, newIdea];
    });
  };

  const handleEdit = (id: number, idea: IdeaContent) => {
    const updatedIdea = ideas.find((idea: Idea) => idea.id === id);

    if (updatedIdea) {
      updatedIdea.content = {
        ...updatedIdea.content,
        ...idea,
      };
    }

    setIdeas(() => {
      return [...ideas];
    });
  };

  const handleDelete = (id: number) => {
    const filteredIdeas = ideas.filter((idea: Idea) => idea.id !== id);

    setIdeas(() => {
      return filteredIdeas;
    });
  };

  const handleClear = () => {
    setIdeas([]);
  };

  return (
    <section className="">
      <Sort handleIdeasSort={handleIdeasSort} />
      <ul className="">
        {ideas.map((idea: Idea) => {
          return (
            <li key={idea.id}>
              <Tile handleCreate={handleCreate} handleEdit={handleEdit} idea={idea} handleDelete={handleDelete} />
            </li>
          );
        })}
      </ul>
      <Tile handleCreate={handleCreate} handleEdit={handleEdit} idea={defaultIdea} autoFocus />
      <button onClick={handleClear}>Clear</button>
    </section>
  );
};

export default Home;
