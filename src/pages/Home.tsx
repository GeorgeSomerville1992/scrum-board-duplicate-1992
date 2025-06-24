import { useState, useEffect } from 'react';
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

  return (
    <>
      {notification && <Notification />}
      <section className="">
        <Sort handleIdeasSort={handleIdeasSort} ideas={ideas} />
        <ul className="">
          {ideas.map((idea: IdeaType) => {
            return (
              <li key={idea.id}>
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
        <Idea handleCreate={handleCreate} handleEdit={handleEdit} idea={defaultIdea} autoFocus />
        <button type="button" onClick={handleClear}>
          Clear
        </button>
      </section>
    </>
  );
};

export default Home;
