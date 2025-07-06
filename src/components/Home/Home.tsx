import { useState, useEffect, useMemo, useRef } from 'react';
import { Idea } from '../Idea/Idea';
import type { IdeaType } from '../../types';
import { Sort } from '../Sort/Sort';
import { useStorage } from '../../hooks/useStorage';
import { Notification } from '../Notification/Notification';
import { sortApi } from '../Sort/sortApi';

export const Home = () => {
  // Default idea used as placeholder.
  const defaultIdea = {
    id: 0,
    title: '',
    description: '',
    createdAt: '',
    modifiedAt: '',
  };

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

  const handleCreate = (idea: Pick<IdeaType, 'title' | 'description'>) => {
    const newIdea = {
      id: ideas.length + 1,
      ...idea,
    };

    setIdeas([...ideas, newIdea]);
    setNotification('created');
  };

  useEffect(() => {
    if (sortRef.current) {
      handleSort(sortRef.current);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ideas.length]);

  const handleEdit = (id: number, IdeaInput: Pick<IdeaType, 'title' | 'description'>) => {
    const updatedIdeas = ideas.map((idea: IdeaType) => {
      if (idea.id === id) {
        return {
          ...idea,
          // refactor to make less complicated - we dont need a content object here
          ...IdeaInput,
          modifiedAt: new Date(),
        };
      }
      // todo look at this?
      return idea;
    });

    setIdeas([...updatedIdeas]);
    setNotification('updated');
  };

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [ideas.length],
  );

  return (
    <>
      <div className="w-screen bg-light-grey flex pl-12 h-12 top-15">
        <Sort handleSort={handleSort} ideas={ideas} />
        <button type="button" onClick={handleClear} className="pl-6">
          Clear
        </button>
      </div>
      {notification && <Notification notification={notification} />}
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
