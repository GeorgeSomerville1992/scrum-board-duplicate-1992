import { useState } from 'react';
import moment from 'moment';
import type { Idea, IdeaContent } from '../../types/index';

type TileProps = {
  idea: Idea;
  handleEdit: (id: number, ideadObj: IdeaContent) => void;
  handleDelete?: (id: number) => void;
  autoFocus: true;
  handleCreate: (id: number, ideadObj: IdeaContent) => void;
};

export const Tile = ({ handleCreate, handleEdit, idea, handleDelete, autoFocus }: TileProps) => {
  const { createdAt, modifiedAt } = idea.content;
  const [title, setTitle] = useState<string>(idea.content.title);
  const [description, setDescription] = useState<string>(idea.content.description);

  const onSubmit = () => {
    const ideaObj = {
      title,
      description,
      createdAt: moment().format(),
    };
    handleCreate(idea.id, ideaObj);

    setTitle('');
    setDescription('');
  };

  const onEdit = () => {
    const ideaObj = {
      title,
      description,
      modifiedAt: moment().format(),
    };

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
      {modifiedAt ? <p>last modified at {moment(modifiedAt).format('MMMM Do YYYY, h:mm:ss a')}</p> : ''}
      {createdAt ? <p>Last created at {moment(createdAt).format('MMMM Do YYYY, h:mm:ss a')}</p> : ''}
      {createdAt ? <button onClick={onEdit}>Edit</button> : <button onClick={onSubmit}>Add</button>}
      {handleDelete ? <button onClick={onDelete}>delete</button> : ''}
    </div>
  );
};
