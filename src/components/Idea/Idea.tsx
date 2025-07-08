import { useState, useRef, useEffect, useMemo } from 'react';
import { format } from 'date-fns';
import type { IdeaType } from '../../types';
import { SubmitButton } from '../Layout/SubmitButton';
import { ErrorText } from '../Layout/ErrorText';
import { useFormik } from 'formik';

type IdeaProps = {
  idea: IdeaType;
  handleEdit: (id: number, ideaInput: Pick<IdeaType, 'title' | 'description'>) => void;
  handleDelete?: (id: number) => void;
  autoFocus: boolean;
  handleCreate: (ideaInput: Pick<IdeaType, 'title' | 'description'>) => void;
};
export const Idea = ({ handleCreate, handleEdit, idea, handleDelete, autoFocus }: IdeaProps) => {
  const { createdAt, modifiedAt } = idea;

  const handleSubmit = (values: Pick<IdeaType, 'title' | 'description'>) => {
    if (createdAt) {
      onEdit(values);
    } else {
      onCreate(values);
    }
  };

  const onCreate = (values: Pick<IdeaType, 'title' | 'description'>) => {
    const { title, description } = values;
    const input = {
      title,
      description,
      createdAt: new Date(),
    };
    handleCreate(input);
    formik.resetForm();
    setCharacterCountdown(140);
  };

  const onEdit = (values: Pick<IdeaType, 'title' | 'description'>) => {
    const { title, description } = values;
    const input = {
      title,
      description,
    };

    handleEdit(idea.id, input);
  };

  const formik = useFormik({
    initialValues: {
      title: idea.title,
      description: idea.description,
    },
    validate: (values) => {
      const errors: { title?: string; description?: string } = {};
      if (!values.title) {
        errors.title = 'Title is required';
      }
      if (!values.description) {
        errors.description = 'Description is required';
      }

      return errors;
    },
    onSubmit: handleSubmit,
  });

  const [characterCountdown, setCharacterCountdown] = useState<number>(140 - formik.values.description.length);
  const isCloseToMaxLength = useMemo(() => characterCountdown <= 20, [characterCountdown]);

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    formik.handleChange(e);
    setCharacterCountdown(140 - e.target.value.length);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    formik.handleChange(e);
  };

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus, idea]);

  const onDelete = () => {
    if (handleDelete) {
      handleDelete(idea.id);
    }
  };
  const isValid = !formik.errors.description && !formik.errors.title;
  return (
    <form className="flex flex-col bg-black rounded-md color text-white p-8 gap-4 h-120" onSubmit={formik.handleSubmit}>
      <input
        aria-label="title"
        value={formik.values.title}
        placeholder="Add a title"
        data-testid="idea-item"
        className="pl-4 h-12 bg-light-grey text-black placeholder-black rounded-md"
        name="title"
        onChange={handleTitleChange}
        ref={inputRef}
      />
      {formik.errors.title && <ErrorText text={formik.errors.title} />}
      <textarea
        value={formik.values.description}
        onChange={handleDescriptionChange}
        className="pl-4 pt-2 h-60 lg:h-18 align-middle rounded-md bg-light-grey placeholder-black text-black overflow-visible"
        placeholder="Add a more detailed description"
        name="description"
        aria-label="description"
        maxLength={140}
      />

      {formik.values.description &&
        (isCloseToMaxLength ? (
          <ErrorText text={`${characterCountdown} characters remaining`} />
        ) : (
          <p>{characterCountdown} characters remaining</p>
        ))}

      {formik.errors.description && <ErrorText text={formik.errors.description} />}

      {isValid && modifiedAt ? <p>Last modified at {format(modifiedAt, 'dd-MM-yyyy HH:mm:ss')}</p> : ''}
      {isValid && createdAt ? <p>Last created at {format(createdAt, 'dd-MM-yyyy HH:mm:ss')}</p> : ''}
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
