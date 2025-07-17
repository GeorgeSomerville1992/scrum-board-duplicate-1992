import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { Idea } from '../Idea/Idea';
import type { IdeaType } from '../../types';
import { Sort } from '../Sort/Sort';
import { useStorage } from '../../hooks/useStorage';
import { Notification } from '../Notification/Notification';
import { sortApi } from '../Sort/sortApi';

export const Home = () => {
  // Default idea used as placeholder.
  const defaultIdea = useMemo(() => {
    return {
      id: 0,
      title: '',
      description: '',
      createdAt: '',
      modifiedAt: '',
    };
  }, []);

  const [ideas, setIdeas] = useStorage('ideas', []);
  const [notification, setNotification] = useState<string>('');

  const sortRef = useRef<keyof typeof sortApi>('');

  useEffect(() => {
    // Show notification for 3 seconds
    if (notification) {
      const timer = setTimeout(() => {
        setNotification('');
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [notification]);

  const handleCreate = useCallback(
    (idea: Pick<IdeaType, 'title' | 'description'>) => {
      const newIdea = {
        id: ideas.length + 1,
        ...idea,
      };

      setIdeas([...ideas, newIdea]);
      setNotification('created');
    },
    [ideas, setIdeas],
  );

  const handleEdit = useCallback(
    (id: number, IdeaInput: Pick<IdeaType, 'title' | 'description'>) => {
      const updatedIdeas = ideas.map((idea: IdeaType) => {
        if (idea.id === id) {
          return {
            ...idea,
            ...IdeaInput,
            modifiedAt: new Date(),
          };
        }
        return idea;
      });

      setIdeas([...updatedIdeas]);
      setNotification('updated');
    },
    [ideas, setIdeas],
  );

  const handleSort = (sort: keyof typeof sortApi) => {
    // Do not sort if default is selected
    if (sort) {
      const sortedIdeas = sortApi[sort].sort(ideas);
      setIdeas(sortedIdeas);
    }
    sortRef.current = sort;
  };

  const handleDelete = (id: number) => {
    const filteredIdeas = ideas.filter((idea: IdeaType) => idea.id !== id);

    setIdeas(filteredIdeas);
    setNotification('deleted');
  };

  const handleClear = () => {
    setIdeas([]);
  };

  // Memoize initial create idea component to keep original input ref highlighted when
  // new ideas are created
  const memoizedIdea = useMemo(
    () => <Idea handleCreate={handleCreate} handleEdit={handleEdit} idea={defaultIdea} autoFocus />,
    [defaultIdea, handleCreate, handleEdit],
  );

  return (
    <>
      <div className="w-screen bg-light-grey flex pl-8 h-12 top-15">
        <Sort handleSort={handleSort} ideas={ideas} />
        <button type="button" onClick={handleClear} className="pl-6">
          Clear
        </button>
      </div>
      {notification && <Notification notification={notification} />}
      <section className="sm:p-12 p-3 sm:max-w-150">
        <>{memoizedIdea}</>
        <ul className="grid-cols-1 grid gap-6 mt-6">
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
      </section>
    </>
  );
};

export default Home;
