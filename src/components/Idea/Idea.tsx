import { useState, useRef, useEffect, useMemo } from 'react';
import { format } from 'date-fns';
import type { IdeaType } from '../../types';
import { SubmitButton } from '../Layout/SubmitButton';
import { ErrorText } from '../Layout/ErrorText';
import { useFormik } from 'formik';

type IdeaInput = Pick<IdeaType, 'title' | 'description'>;

type IdeaProps = {
  idea: IdeaType;
  handleEdit: (id: number, ideaInput: IdeaInput) => void;
  handleDelete?: (id: number) => void;
  autoFocus: boolean;
  handleCreate: (ideaInput: IdeaInput) => void;
};
export const Idea = ({ handleCreate, handleEdit, idea, handleDelete, autoFocus }: IdeaProps) => {
  const { createdAt, modifiedAt } = idea;

  const handleSubmit = (values: IdeaInput) => {
    if (createdAt) {
      onEdit(values);
    } else {
      onCreate(values);
    }
  };

  const onCreate = (values: IdeaInput) => {
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

  const onEdit = (values: IdeaInput) => {
    const { title, description } = values;
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

  const isValid = !formik.errors.description && !formik.errors.title;
  return (
    <form
      className={`flex flex-col bg-black rounded-(--input-border-radius) color text-white p-6 gap-4 max-h-120 min-h-(--form-min-height)`}
      onSubmit={formik.handleSubmit}
    >
      <input
        aria-label="title"
        value={formik.values.title}
        placeholder="Add a title"
        data-testid="idea-item"
        className="pl-4 h-12 bg-(--color-input-background) text-lg placeholder-(--color-input-text) rounded-(--input-border-radius) text-(--color-input-text)"
        name="title"
        onChange={handleTitleChange}
        ref={inputRef}
      />
      <textarea
        value={formik.values.description}
        onChange={handleDescriptionChange}
        className="pl-4 pt-2 h-20 lg:h-18 align-middle text-lg rounded-(--input-border-radius) bg-(--color-input-background) placeholder-(--color-input-text) text-(--color-input-text) overflow-visible"
        placeholder="Add a more detailed description"
        name="description"
        aria-label="description"
        maxLength={140}
      />
      {formik.errors.title && <ErrorText text={formik.errors.title} />}
      {formik.values.description &&
        (isCloseToMaxLength ? (
          <ErrorText text={`${characterCountdown} characters remaining`} />
        ) : (
          <p>{characterCountdown} characters remaining</p>
        ))}

      {formik.errors.description && <ErrorText text={formik.errors.description} />}

      {isValid && modifiedAt ? <p>Modified at {format(modifiedAt, 'dd-MM-yyyy HH:mm:ss')}</p> : ''}
      {isValid && createdAt ? <p>Created at {format(createdAt, 'dd-MM-yyyy HH:mm:ss')}</p> : ''}
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
