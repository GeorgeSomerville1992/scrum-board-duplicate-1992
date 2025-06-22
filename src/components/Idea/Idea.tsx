import { useState } from 'react';
import { format } from "date-fns";
import type { IdeaType } from '../../types/index';

type IdeaProps = {
  idea: IdeaType;
  handleEdit: (id: number, ideaObj: IdeaType['content']) => void;
  handleDelete?: (id: number) => void;
  autoFocus: true;
  handleCreate: (ideaObj: IdeaType['content']) => void;
};

export const Idea = ({ handleCreate, handleEdit, idea, handleDelete, autoFocus }: IdeaProps) => {
  const { createdAt, modifiedAt } = idea.content;
  const [title, setTitle] = useState<string>(idea.content.title);
  const [description, setDescription] = useState<string>(idea.content.description);
  console.log('idea ==>', idea);
  const onSubmit = () => {
    const ideaObj = {
      title,
      description,
      createdAt: new Date(),
    };
    handleCreate(ideaObj);

    setTitle('');
    setDescription('');
  };

  const onEdit = () => {
    const ideaObj = {
      title,
      description,
      modifiedAt: new Date(),
    };

    console.log('On Edit', ideaObj);

    handleEdit(idea.id, ideaObj);
  };

  const onDelete = () => {
    handleDelete(idea.id);
  };

  return (
    <div className="">
      <input
        aria-label={`idea${idea.id}title`}
        value={title}
        placeholder="Enter a title"
        data-testid="idea-item"
        name={`idea${idea.id}title`}
        onChange={(e) => setTitle(e.target.value)}
        autoFocus={autoFocus}
        required
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows="2"
        cols="50"
        aria-label={`idea${idea.id}description`}
        maxLength={140}
        required
      />
      {modifiedAt ? <p>last modified at {format(modifiedAt, 'dd-MM-yyyy HH:mm:ss')}</p> : ''}
      {createdAt ? <p>Last created at {format(createdAt, 'dd-MM-yyyy HH:mm:ss')}</p> : ''}
      {createdAt ? <button onClick={onEdit}>Edit</button> : <button onClick={onSubmit}>Add</button>}
      {handleDelete ? <button onClick={onDelete}>delete</button> : ''}
    </div>
  );
};
