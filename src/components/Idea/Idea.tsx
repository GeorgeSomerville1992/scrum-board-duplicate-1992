import { useState, useRef, useEffect, useMemo } from 'react';
import { format } from 'date-fns';
import type { IdeaType } from '../../types';
import { SubmitButton } from '../Layout/SubmitButton';
import { ErrorText } from '../Layout/ErrorText';

type IdeaProps = {
  idea: IdeaType;
  handleEdit: (id: number, ideaInput: Pick<IdeaType, 'title' | 'description'>) => void;
  handleDelete?: (id: number) => void;
  autoFocus: boolean;
  handleCreate: (ideaInput: Pick<IdeaType, 'title' | 'description'>) => void;
};
export const Idea = ({ handleCreate, handleEdit, idea, handleDelete, autoFocus }: IdeaProps) => {
  const { createdAt, modifiedAt } = idea;
  const [title, setTitle] = useState<string>(idea.title);
  const [description, setDescription] = useState<string>(idea.description);
  const [descriptionError, setDescriptionError] = useState('');
  const [titleError, setTitleError] = useState('');
  const [characterCountdown, setCharacterCountdown] = useState<number>(140 - description.length);
  const isCloseToMaxLength = useMemo(() => characterCountdown <= 20, [characterCountdown]);

  const handleValidation = () => {
    let isValid = true;

    if (titleError || descriptionError || !title || !description) {
      isValid = false;
    }

    if (!title) {
      setTitleError('Title is required');
    }

    if (!description) {
      setDescriptionError('Description is required');
    }

    return isValid;
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value);
    setCharacterCountdown(140 - e.target.value.length);
    if (e.target.value.length < 1) {
      setDescriptionError('Description is required');
      return;
    }

    if (descriptionError && e.target.value.length > 0) {
      setDescriptionError('');
    }
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);

    if (e.target.value.length < 1) {
      setTitleError('Title is required');
      return;
    }

    if (titleError && e.target.value.length > 0) {
      setTitleError('');
    }
  };

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus, idea]);

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    const isValid = handleValidation();
    if (!isValid) {
      return;
    }

    if (createdAt) {
      onEdit();
    } else {
      onCreate();
    }
  };

  const onCreate = () => {
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
    <form className="flex flex-col bg-black rounded-md color text-white p-8 gap-4 h-100" onSubmit={handleSubmit}>
      <input
        aria-label="title"
        value={title}
        placeholder="Add a title"
        data-testid="idea-item"
        className="pl-4 h-12 bg-light-grey text-black placeholder-black rounded-md"
        name="title"
        onChange={(e) => handleTitleChange(e)}
        ref={inputRef}
      />
      <textarea
        value={description}
        onChange={(e) => handleDescriptionChange(e)}
        className="pl-4 pt-2 h-18 align-middle rounded-md bg-light-grey placeholder-black text-black overflow-visible"
        placeholder="Add a more detailed description"
        name="description"
        aria-label="description"
        maxLength={140}
      />

      {description &&
        (isCloseToMaxLength ? (
          <ErrorText text={`${characterCountdown} characters remaining`} />
        ) : (
          <p>{characterCountdown} characters remaining</p>
        ))}

      {titleError && <ErrorText text={titleError} />}
      {descriptionError && <ErrorText text={descriptionError} />}

      {modifiedAt ? <p>last modified at {format(modifiedAt, 'dd-MM-yyyy HH:mm:ss')}</p> : ''}
      {createdAt ? <p>Last created at {format(createdAt, 'dd-MM-yyyy HH:mm:ss')}</p> : ''}
      <div className="flex items-end flex-grow-1">
        {createdAt ? <SubmitButton text="Save" /> : <SubmitButton text="Add an idea" />}
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
    </form>
  );
};
