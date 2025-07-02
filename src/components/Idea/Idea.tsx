import { useState, useRef, useEffect, useMemo } from 'react';
import { format } from 'date-fns';
import type { IdeaType } from '../../types';

type IdeaProps = {
  idea: IdeaType;
  handleEdit: (id: number, ideaInput: Pick<IdeaType['content'], 'title' | 'description'>) => void;
  handleDelete?: (id: number) => void;
  autoFocus: boolean;
  handleCreate: (ideaInput: Pick<IdeaType['content'], 'title' | 'description'>) => void;
};
export const Idea = ({ handleCreate, handleEdit, idea, handleDelete, autoFocus }: IdeaProps) => {
  const { createdAt, modifiedAt } = idea.content;
  const [title, setTitle] = useState<string>(idea.content.title);
  const [description, setDescription] = useState<string>(idea.content.description);
  const [characterCountdown, setCharacterCountdown] = useState<number>(140 - description.length);

  // title and description change handlers will create many re-renders, so we use useMemo to avoid unnecessary calculations.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const isCloseToMaxLength = useMemo(() => characterCountdown <= 20, [characterCountdown <= 20]);
  const isDisabled = useMemo(
    () => title.length === 0 || description.length === 0,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [title.length < 1, description.length < 1],
  );

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value);
    setCharacterCountdown(140 - e.target.value.length);
  };

  const inputRef = useRef<HTMLInputElement>(null);

  /* Keep the input place holder in focus when the idea is created or edited. */
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus, idea]);

  const onSubmit = () => {
    const input = {
      title,
      description,
      createdAt: new Date(),
    };
    handleCreate(input);

    setTitle('');
    setDescription('');
    setCharacterCountdown(140);
  };

  const onEdit = () => {
    const input = {
      title,
      description,
    };

    handleEdit(idea.id, input);
  };

  const onDelete = () => {
    if (handleDelete) {
      handleDelete(idea.id);
    }
  };

  return (
    <div className="flex flex-col bg-black rounded-md color text-white p-8 gap-4 h-100">
      <input
        aria-label="title"
        value={title}
        placeholder="Add a title"
        data-testid="idea-item"
        className="pl-4 h-12 bg-light-grey text-black placeholder-black rounded-md"
        name="title"
        onChange={(e) => setTitle(e.target.value)}
        ref={inputRef}
        required
      />
      <textarea
        value={description}
        onChange={(e) => handleDescriptionChange(e)}
        className="pl-4 pt-2 h-18 align-middle rounded-md bg-light-grey placeholder-black text-black overflow-visible"
        placeholder="Add a more detailed description"
        name="description"
        aria-label="description"
        maxLength={140}
        required
      />
      {description && (
        <p className={`${isCloseToMaxLength ? 'text-red-500' : ''}`}>{characterCountdown} characters remaining</p>
      )}
      {modifiedAt ? <p>last modified at {format(modifiedAt, 'dd-MM-yyyy HH:mm:ss')}</p> : ''}
      {createdAt ? <p>Last created at {format(createdAt, 'dd-MM-yyyy HH:mm:ss')}</p> : ''}
      <div className="flex items-end flex-grow-1">
        {createdAt ? (
          <button
            type="button"
            className="bg-button-secondary text-black pl-4 pr-4 pt-2 pb-2 rounded-lg"
            onClick={onEdit}
          >
            Edit
          </button>
        ) : (
          <button
            type="button"
            className="btn-primay bg-button-primary text-white pl-4 pr-4 pt-2 pb-2 rounded-lg"
            onClick={onSubmit}
            disabled={isDisabled}
          >
            Add an idea
          </button>
        )}
        {handleDelete && (
          <button
            type="button"
            className="bg-button-secondary text-black pl-4 pr-4 pt-2 pb-2 rounded-lg ml-4"
            onClick={onDelete}
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
};
