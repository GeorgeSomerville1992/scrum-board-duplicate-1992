import { useState, useRef, useEffect, useMemo } from 'react';
import { format } from 'date-fns';
import type { IdeaType } from '../../types';
import { SubmitButton } from '../Layout/SubmitButton';
import { ErrorText } from '../Layout/ErrorText';
import { useForm, SubmitHandler } from "react-hook-form"

type IdeaProps = {
  idea: IdeaType;
  handleEdit: (id: number, ideaInput: Pick<IdeaType, 'title' | 'description'>) => void;
  handleDelete?: (id: number) => void;
  autoFocus: boolean;
  handleCreate: (ideaInput: Pick<IdeaType, 'title' | 'description'>) => void;
};

type Inputs = {
  title: string
  description: string
}

export const Idea = ({ handleCreate, handleEdit, idea, handleDelete, autoFocus }: IdeaProps) => {
  const { createdAt, modifiedAt } = idea;
  const [title, setTitle] = useState<string>(idea.title);
  const [description, setDescription] = useState<string>(idea.description);
  const [descriptionError, setDescriptionError] = useState('');
  const [titleError, setTitleError] = useState('');
  const [characterCountdown, setCharacterCountdown] = useState<number>(140 - description.length);
  const isCloseToMaxLength = useMemo(() => characterCountdown <= 20, [characterCountdown]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setFocus,
    clearErrors,
  } = useForm<Inputs>()

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value);
    setCharacterCountdown(140 - e.target.value.length);
    
    if (errors[e.target.name]) {
      console.log('triggering validation for', e.target.name);
      // triggerValidation({ name: e.target.name });
      clearErrors(e.target.name);
    }
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);

    if (errors[e.target.name]) {
      console.log('triggering validation for', e.target.name);
      // triggerValidation({ name: e.target.name });
      clearErrors(e.target.name);
    }
  };

  const titleInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (autoFocus && titleInputRef.current) {
      titleInputRef.current.focus();
    }
  }, [autoFocus, idea]);

  useEffect(() => {
    if(autoFocus && setFocus) {
      setFocus("title");
    }
  }, [setFocus, autoFocus, idea])

  const onSubmit: SubmitHandler<Inputs> = () => {
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
    <form className="flex flex-col bg-black rounded-md color text-white p-8 gap-4 h-100" onSubmit={handleSubmit(onSubmit)}>
      <input
        {...register('title', { required: {
          value: true,
          message: "Title is required",
        }})} 
        aria-label="title"
        value={title}
        placeholder="Add a title"
        data-testid="idea-item"
        className="pl-4 h-12 bg-light-grey text-black placeholder-black rounded-md"
        name="title"
        onChange={(e) => handleTitleChange(e)}
        // ref={titleInputRef}
      />
      <textarea
        value={description}
        {...register('description', { required: "Description is required" })}
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

      {errors.title?.message && <ErrorText text={errors.title.message} />}
      {errors.description?.message && <ErrorText text={errors.description.message} />}

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
