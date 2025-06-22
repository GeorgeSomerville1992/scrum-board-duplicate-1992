import { describe, expect, it } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { App } from './App';
import { MemoryRouter } from 'react-router';
import userEvent from '@testing-library/user-event';

describe('App', () => {
  it('Renders Scrum app', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>,
    );
    expect(
      screen.getByRole('heading', {
        level: 1,
      }),
    ).toHaveTextContent('Scrum App');
  });

  it('Renders a tile on inital load', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>,
    );

    expect(screen.getByRole('textbox', { name: /idea1title/i })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: /idea1description/i })).toBeInTheDocument();

    expect(screen.getByRole('button', { name: /add/i })).toBeInTheDocument();
  });

  it('Adds a tile', async () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>,
    );
    const title = screen.getByRole('textbox', { name: /idea1title/i });
    const description = screen.getByRole('textbox', {
      name: /idea1description/i,
    });
    const submit = screen.getByRole('button', { name: /Add/i });

    await userEvent.type(title, 'testTitle');
    await userEvent.type(description, 'testDescription');

    expect(title).toHaveValue('testTitle');
    expect(description).toHaveValue('testDescription');

    await userEvent.click(submit);
    expect(screen.queryAllByRole('textbox')).toHaveLength(4);
    // mroe specfic text box...
  });

  it('Deletes a tile', async () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>,
    );
    const title = screen.getByRole('textbox', { name: /idea1title/i });
    const description = screen.getByRole('textbox', {
      name: /idea1description/i,
    });
    const submit = screen.getByRole('button', { name: /Add/i });

    await userEvent.type(title, 'testTitle');
    await userEvent.type(description, 'testDescription');

    expect(title).toHaveValue('testTitle');
    expect(description).toHaveValue('testDescription');

    await userEvent.click(submit);

    // TODO - assert this better
    expect(screen.queryAllByRole('textbox')).toHaveLength(4);
  });

  it('Edits a tile', async () => {
    // JEst mock the dates
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>,
    );

    const title = screen.getByRole('textbox', { name: /idea1title/i });
    const description = screen.getByRole('textbox', {
      name: /idea1description/i,
    });
    const submit = screen.getByRole('button', { name: /Add/i });

    await userEvent.type(title, 'testTitle');
    await userEvent.type(description, 'testDescription');

    await userEvent.click(submit);
    const edit = screen.getByRole('button', { name: /Edit/i });

    // TODO - assert this better
    expect(screen.queryAllByRole('textbox')).toHaveLength(4);

    expect(edit).toBeInTheDocument();
    await userEvent.type(title, 'testTitleEdited');
    await userEvent.type(description, 'testDescriptionEdited');

    await userEvent.click(edit);
    // how can we simulate a last modfied date here?
    expect(screen.getByText('last modified at January 1st 2022, 12:00:00 am')).toBeInTheDocument();
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

    // find a way to create list dynamically vi import rather than manually
    // perhaps do it mocking storage..
    it('sorts a list alphatically', () => {
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
      expect(ideas[0].value).toBe('Apple');
      expect(ideas[1].value).toBe('Pear');
    });

    it('it sorts a list from created date', () => {
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
      expect(ideas[0].value).toBe('Pear');
      expect(ideas[1].value).toBe('Apple');
    });
  });

  it('Renders not found if invalid path', () => {
    render(
      <MemoryRouter initialEntries={['/this-route-does-not-exist']}>
        <App />
      </MemoryRouter>,
    );
    expect(
      screen.getByRole('heading', {
        level: 1,
      }),
    ).toHaveTextContent('Not Found');
  });

  it('Renders not found if invalid path', () => {
    render(
      <MemoryRouter initialEntries={['/this-route-does-not-exist']}>
        <App />
      </MemoryRouter>,
    );
    expect(
      screen.getByRole('heading', {
        level: 1,
      }),
    ).toHaveTextContent('404');

    expect(screen.getByText('Take me back to')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Home' })).toBeInTheDocument();
  });
});
