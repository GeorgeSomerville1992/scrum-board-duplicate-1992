import { Idea } from '../components/Idea/Idea';
import { sortApi } from '../components/Sort/sortApi';
import type { IdeaType } from '../types/index';
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
  console.log('ideads', ideas);
  const handleIdeasSort = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const sortedIdeas = sortApi[event.target.value as keyof typeof sortApi].sort(ideas);
    setIdeas(sortedIdeas);
  };

  const handleCreate = (idea: IdeaType['content']) => {
    const newIdea = {
      id: ideas.length + 1,
      content: idea,
    };

    setIdeas(() => {
      return [...ideas, newIdea];
    });
  };

  const handleEdit = (id: number, idea: IdeaType['content']) => {
    const updatedIdea = ideas.find((idea: IdeaType) => idea.id === id);

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
    const filteredIdeas = ideas.filter((idea: IdeaType) => idea.id !== id);

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
        {ideas.map((idea: IdeaType) => {
          return (
            <li key={idea.id}>
              <Idea handleCreate={handleCreate} handleEdit={handleEdit} idea={idea} handleDelete={handleDelete} />
            </li>
          );
        })}
      </ul>
      <Idea handleCreate={handleCreate} handleEdit={handleEdit} idea={defaultIdea} autoFocus />
      <button onClick={handleClear}>Clear</button>
    </section>
  );
};

export default Home;
