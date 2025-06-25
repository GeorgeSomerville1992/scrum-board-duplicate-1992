import { useState, useEffect, useMemo } from 'react';
import { Idea } from '../components/Idea/Idea';
import type { IdeaType, IdeaInput } from '../types/index';
import { Sort } from '../components/Sort/Sort';
import { useStorage } from '../hooks/useStorage';
import { Notification } from '../components/Notification/Notification';

export const Home = () => {
  // Default idea used as placeholder.
  const defaultIdea = {
    id: 0,
    content: {
      title: '',
      description: '',
      createdAt: '',
      modifiedAt: '',
    },
  };

  const [ideas, setIdeas] = useStorage('ideas', []);
  const [notification, setNotification] = useState<boolean>(false);

  useEffect(() => {
    // Show notification for 3 seconds
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [notification]);

  const handleIdeasSort = (sortedIdeas: IdeaType[]) => {
    setIdeas(sortedIdeas);
  };

  const handleCreate = (idea: IdeaInput) => {
    const newIdea = {
      id: ideas.length + 1,
      content: idea,
    };

    setIdeas([...ideas, newIdea]);
  };

  const handleEdit = (id: number, IdeaInput: IdeaInput) => {
    const updatedIdeas = ideas.map((idea: IdeaType) => {
      // https://web.dev/blog/array-with#:~:text=In%20conclusion%2C%20immutable%20updates%20can,without%20mutating%20the%20original%20array.
      // use of .with?
      if (idea.id === id) {
        return {
          ...idea,
          content: {
            ...idea.content,
            ...IdeaInput,
            modifiedAt: new Date(),
          },
        };
      }
      return idea;
    });

    setIdeas([...updatedIdeas]);

    setNotification(true);
  };

  const handleDelete = (id: number) => {
    const filteredIdeas = ideas.filter((idea: IdeaType) => idea.id !== id);

    setIdeas(filteredIdeas);
  };

  const handleClear = () => {
    setIdeas([]);
  };

  // Memoize initial create idea component to keep original input ref highlighted when
  // new ideas are created
  const memoizedIdea = useMemo(
    () => <Idea handleCreate={handleCreate} handleEdit={handleEdit} idea={defaultIdea} autoFocus />,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [ideas.length],
  );

  return (
    <>
      <nav className="w-screen bg-light-grey flex pl-12 h-12">
        <Sort handleIdeasSort={handleIdeasSort} ideas={ideas} />
        <button type="button" onClick={handleClear} className="pl-12">
          Clear
        </button>
      </nav>
      {notification && <Notification />}
      <section className="p-12 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>{memoizedIdea}</div>
        <ul>
          {ideas.map((idea: IdeaType) => {
            return (
              <li key={idea.id} className="mb-4">
                <Idea
                  handleCreate={handleCreate}
                  handleEdit={handleEdit}
                  idea={idea}
                  handleDelete={handleDelete}
                  autoFocus={false}
                />
              </li>
            );
          })}
        </ul>
      </section>
    </>
  );
};

export default Home;
