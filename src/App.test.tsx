import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { App } from './App';
import { MemoryRouter } from 'react-router';
import userEvent from '@testing-library/user-event';

describe('App', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    vi.useRealTimers();
  });
  describe('Form', () => {
    it('Renders a Idea on inital load', () => {
      render(
        <MemoryRouter initialEntries={['/']}>
          <App />
        </MemoryRouter>,
      );

      expect(
        screen.getByRole('heading', {
          level: 1,
        }),
      ).toHaveTextContent('Ideas App');

      expect(screen.getByRole('textbox', { name: /title/i })).toBeInTheDocument();
      expect(screen.getByRole('textbox', { name: /description/i })).toBeInTheDocument();

      expect(screen.getByRole('button', { name: /add/i })).toBeInTheDocument();
    });

    it('Adds a Idea', async () => {
      render(
        <MemoryRouter initialEntries={['/']}>
          <App />
        </MemoryRouter>,
      );
      const title = screen.getByRole('textbox', { name: /title/i });
      const description = screen.getByRole('textbox', {
        name: /description/i,
      });
      const submit = screen.getByRole('button', { name: /Add/i });

      await userEvent.type(title, 'testTitle');
      await userEvent.type(description, 'testDescription');

      expect(title).toHaveValue('testTitle');
      expect(description).toHaveValue('testDescription');

      await userEvent.click(submit);
      expect(screen.queryAllByRole('textbox')).toHaveLength(4);
      expect(screen.getByText('Idea created successfully!')).toBeInTheDocument();
    });

    it('Deletes a Idea', async () => {
      render(
        <MemoryRouter initialEntries={['/']}>
          <App />
        </MemoryRouter>,
      );

      expect(screen.queryAllByRole('textbox')).toHaveLength(2);
      const title = screen.getByRole('textbox', { name: /title/i });
      const description = screen.getByRole('textbox', {
        name: /description/i,
      });
      const submit = screen.getByRole('button', { name: /Add/i });

      await userEvent.type(title, 'testTitle');
      await userEvent.type(description, 'testDescription');
      await userEvent.click(submit);
      // expect the idea was created
      expect(screen.queryAllByRole('textbox')).toHaveLength(4);

      const deleteBtn = screen.getByRole('button', { name: /Delete/i });

      expect(deleteBtn).toBeInTheDocument();
      await userEvent.click(deleteBtn);

      // test the notification
      expect(screen.getByText('Idea deleted successfully!')).toBeInTheDocument();
      expect(screen.queryAllByRole('textbox')).toHaveLength(2);
    });

    it('Edits a Idea', async () => {
      const mockDate = new Date(2022, 0, 1);
      vi.setSystemTime(mockDate);

      render(
        <MemoryRouter initialEntries={['/']}>
          <App />
        </MemoryRouter>,
      );

      const title = screen.getByRole('textbox', { name: /title/i });
      const description = screen.getByRole('textbox', {
        name: /description/i,
      });
      const submit = screen.getByRole('button', { name: /Add an idea/i });

      await userEvent.type(title, 'testTitle');
      await userEvent.type(description, 'testDescription');
      await userEvent.click(submit);

      const edit = screen.getByRole('button', { name: /Edit/i });

      expect(edit).toBeInTheDocument();

      const titleEdit = screen.getAllByRole('textbox', { name: /title/i })[1];
      const descriptionEdit = screen.queryAllByRole('textbox', {
        name: /description/i,
      })[1];

      await userEvent.type(titleEdit, 'Edited');

      await userEvent.type(descriptionEdit, 'Edited');

      await userEvent.click(edit);

      expect(screen.getByText('last modified at 01-01-2022 00:00:00')).toBeInTheDocument();
      expect(screen.queryAllByRole('textbox', { name: /title/i })[1]).toHaveValue('testTitleEdited');

      // test the notification
      expect(screen.getByText('Idea updated successfully!')).toBeInTheDocument();
    });
  });
  describe('Sorting', () => {
    const mockIdeas = [
      {
        id: 1,
        content: {
          title: 'Pear',
          description: '',
          createdAt: '',
          modifiedAt: '',
        },
      },
      {
        id: 2,
        content: {
          title: 'Apple',
          description: '',
          createdAt: '',
          modifiedAt: '',
        },
      },
    ];

    it('Sorts a list alphatically', () => {
      localStorage.setItem('ideas', JSON.stringify(mockIdeas));
      render(
        <MemoryRouter initialEntries={['/']}>
          <App />
        </MemoryRouter>,
      );

      // First, sort the patients
      const dropdown = screen.getByRole('combobox');
      expect(screen.getByDisplayValue('Apple')).toBeInTheDocument();
      fireEvent.change(dropdown, { target: { value: 'alphabetically' } });

      const ideas = screen.queryAllByTestId('idea-item');

      expect((ideas[1] as HTMLInputElement).value).toBe('Apple');
      expect((ideas[2] as HTMLInputElement).value).toBe('Pear');
    });

    it('Sorts a list from created date', () => {
      localStorage.setItem('ideas', JSON.stringify(mockIdeas));
      render(
        <MemoryRouter initialEntries={['/']}>
          <App />
        </MemoryRouter>,
      );

      // First, sort the patients
      const dropdown = screen.getByRole('combobox');
      expect(screen.getByDisplayValue('Apple')).toBeInTheDocument();
      fireEvent.change(dropdown, { target: { value: 'creationDate' } });

      const ideas = screen.queryAllByTestId('idea-item');
      expect((ideas[1] as HTMLInputElement).value).toBe('Pear');
      expect((ideas[2] as HTMLInputElement).value).toBe('Apple');
    });
  });

  it('Renders not found if invalid path', () => {
    render(
      <MemoryRouter initialEntries={['/this-route-does-not-exist']}>
        <App />
      </MemoryRouter>,
    );

    expect(screen.getByText('Ideas App')).toBeInTheDocument();
    expect(screen.getByText('404')).toBeInTheDocument();
    expect(screen.getByText('Take me back to')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Home' })).toBeInTheDocument();
  });
});
