import { beforeEach, describe, expect, it, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { App } from './App';

const mockIdeas = [
  {
    id: 1,
    title: 'Pear',
    description: 'pear description',
    createdAt: '2025-07-06T14:14:16.478Z',
    modifiedAt: '',
  },
  {
    id: 2,
    title: 'Apple',
    description: 'apple description',
    createdAt: '2025-07-06T14:14:16.478Z',
    modifiedAt: '',
  },
];

describe('App', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('Form', () => {
    it('Renders a Idea on inital load', () => {
      render(<App />);

      expect(
        screen.getByRole('heading', {
          level: 1,
        }),
      ).toHaveTextContent('Ideas App');

      expect(screen.getByRole('textbox', { name: /title/i })).toBeInTheDocument();
      expect(screen.getByRole('textbox', { name: /description/i })).toBeInTheDocument();

      expect(screen.getByRole('button', { name: /add/i })).toBeInTheDocument();
    });

    it('handles empty title and description', async () => {
      render(<App />);
      screen.debug();
      const submit = screen.getByRole('button', { name: /Add an idea/i });

      // await fireEvent.click(submit);
      await userEvent.click(submit);
      expect(screen.getByText('Title is required')).toBeInTheDocument();
      expect(screen.getByText('Description is required')).toBeInTheDocument();
      // await waitFor(() => {

      // });

      // Error should no longer be displayed when user starts typing again.

      const title = screen.getByRole('textbox', { name: /title/i });
      const description = screen.getByRole('textbox', {
        name: /description/i,
      });
      await fireEvent.change(title, { target: { value: 'testTitle' } });
      await fireEvent.change(description, { target: { value: 'testDescription' } });

      expect(screen.queryByText('Title is required')).not.toBeInTheDocument();
      expect(screen.queryByText('Description is required')).not.toBeInTheDocument();
    });

    // it('Adds a Idea', async () => {
    //   render(<App />);
    //   const title = screen.getByRole('textbox', { name: /title/i });
    //   const description = screen.getByRole('textbox', {
    //     name: /description/i,
    //   });
    //   const submit = screen.getByRole('button', { name: /Add/i });

    //   await fireEvent.change(title, { target: { value: 'testTitle' } });
    //   await fireEvent.change(description, { target: { value: 'testDescription' } });

    //   expect(title).toHaveValue('testTitle');
    //   expect(description).toHaveValue('testDescription');
    //   await fireEvent.click(submit);

    //   expect(screen.queryAllByRole('textbox')).toHaveLength(4);
    //   expect(screen.getByText('Idea created successfully!')).toBeInTheDocument();
    // });

    // it('Deletes a Idea', async () => {
    //   render(<App />);

    //   expect(screen.queryAllByRole('textbox')).toHaveLength(2);
    //   const title = screen.getByRole('textbox', { name: /title/i });
    //   const description = screen.getByRole('textbox', {
    //     name: /description/i,
    //   });
    //   const submit = screen.getByRole('button', { name: /Add/i });

    //   await fireEvent.change(title, { target: { value: 'testTitle' } });
    //   await fireEvent.change(description, { target: { value: 'testDescription' } });

    //   await fireEvent.click(submit);
    //   // expect the idea was created
    //   expect(screen.queryAllByRole('textbox')).toHaveLength(4);

    //   const deleteBtn = screen.getByRole('button', { name: /Delete/i });

    //   expect(deleteBtn).toBeInTheDocument();
    //   await fireEvent.click(deleteBtn);

    //   // test the notification
    //   expect(screen.getByText('Idea deleted successfully!')).toBeInTheDocument();
    //   expect(screen.queryAllByRole('textbox')).toHaveLength(2);

    //   act(() => {
    //     vi.advanceTimersByTime(3000);
    //   });

    //   // Verify notification is cleared
    //   expect(screen.queryByText('created')).not.toBeInTheDocument();
    // });

    // it('handles empty title and description on edit', async () => {
    //   localStorage.setItem('ideas', JSON.stringify(mockIdeas));
    //   render(<App />);

    //   const title = screen.queryAllByRole('textbox', { name: /title/i })[1];
    //   const description = screen.queryAllByRole('textbox', {
    //     name: /description/i,
    //   })[1];

    //   await fireEvent.change(title, { target: { value: '' } });
    //   await fireEvent.change(description, { target: { value: '' } });

    //   const save = screen.getAllByRole('button', { name: /Save/i })[0];

    //   expect(save).toBeInTheDocument();

    //   await fireEvent.click(save);

    //   expect(screen.getByText('Title is required')).toBeInTheDocument();
    //   expect(screen.getByText('Description is required')).toBeInTheDocument();
    // });

    // it('Edits a Idea', async () => {
    //   const mockDate = new Date(2022, 0, 1);
    //   vi.setSystemTime(mockDate);

    //   render(<App />);

    //   const title = screen.getByRole('textbox', { name: /title/i });
    //   const description = screen.getByRole('textbox', {
    //     name: /description/i,
    //   });
    //   const submit = screen.getByRole('button', { name: /Add an idea/i });

    //   await fireEvent.change(title, { target: { value: 'testTitle1' } });
    //   await fireEvent.change(description, { target: { value: 'testDescription1' } });
    //   await fireEvent.click(submit);

    //   await fireEvent.change(title, { target: { value: 'testTitle2' } });
    //   await fireEvent.change(description, { target: { value: 'testDescription2' } });
    //   await fireEvent.click(submit);

    //   const save = screen.getAllByRole('button', { name: /Save/i })[1];

    //   expect(save).toBeInTheDocument();

    //   const titleEdit = screen.getAllByRole('textbox', { name: /title/i })[1];
    //   const descriptionEdit = screen.queryAllByRole('textbox', {
    //     name: /description/i,
    //   })[1];

    //   await fireEvent.change(titleEdit, { target: { value: 'testTitle1Edited' } });
    //   await fireEvent.change(descriptionEdit, { target: { value: 'Edited' } });

    //   await fireEvent.click(save);

    //   expect(screen.getByText('last modified at 01-01-2022 00:00:00')).toBeInTheDocument();
    //   expect(screen.queryAllByRole('textbox', { name: /title/i })[1]).toHaveValue('testTitle1Edited');

    //   // check other idea is not modified
    //   expect(screen.queryAllByRole('textbox', { name: /title/i })[2]).toHaveValue('testTitle2');

    //   // test the notification
    //   expect(screen.getByText('Idea updated successfully!')).toBeInTheDocument();
    // });
  });
  describe('Sorting', () => {
    it('Clears storage', async () => {
      localStorage.setItem('ideas', JSON.stringify(mockIdeas));
      render(<App />);

      const ideas = screen.queryAllByTestId('idea-item');
      expect(ideas).toHaveLength(3);

      // First, sort the patients
      const clear = screen.getByRole('button', { name: /Clear/i });
      await fireEvent.click(clear);
      const clearedIdeas = screen.queryAllByTestId('idea-item');
      expect(clearedIdeas).toHaveLength(1);
    });

    it('Sorts a list alphatically', () => {
      localStorage.setItem('ideas', JSON.stringify(mockIdeas));
      render(<App />);

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
      render(<App />);

      // First, sort the patients
      const dropdown = screen.getByRole('combobox');
      expect(screen.getByDisplayValue('Apple')).toBeInTheDocument();
      fireEvent.change(dropdown, { target: { value: 'creationDate' } });

      const ideas = screen.queryAllByTestId('idea-item');
      expect((ideas[1] as HTMLInputElement).value).toBe('Pear');
      expect((ideas[2] as HTMLInputElement).value).toBe('Apple');
    });
  });
});
