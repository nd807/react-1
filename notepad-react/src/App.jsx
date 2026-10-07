import { useState } from 'react';
import styled from '@emotion/styled';

const Page = styled.main`
  max-width: 900px;
  margin: 40px auto;
  padding: 0 16px;
`;

const Notepad = styled.section`
  display: grid;
  grid-template-columns: 240px 1fr;
  min-height: 480px;
  overflow: hidden;
  border: 1px solid #ddd;
  border-radius: 10px;
  background: white;

  button, input, textarea {
    border: 1px solid #aaa;
    border-radius: 6px;
  }

  @media (max-width: 650px) {
    grid-template-columns: 1fr;
  }
`;

const Sidebar = styled.aside`
  min-width: 0;
  padding: 16px;
  border-right: 1px solid #ddd;
  background: #f6f6f6;

  .header { display: flex; align-items: center; justify-content: space-between; }
  h2 { margin: 0; }
  .add { padding: 6px 11px; color: white; background: #3156d3; }
  input { width: 100%; margin: 14px 0; padding: 8px; }
  .notes { display: grid; gap: 6px; }

  @media (max-width: 650px) {
    border-right: 0;
    border-bottom: 1px solid #ddd;
  }
`;

const NoteButton = styled.button`
  width: 100%;
  min-width: 0;
  padding: 9px;
  background: ${({ $active }) => ($active ? '#dfe7ff' : 'white')};
  text-align: left;
  cursor: pointer;

  strong, span {
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  span { margin-top: 3px; color: #777; font-size: 13px; }
`;

const Editor = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
  min-width: 0;
  padding: 20px;

  .header { display: flex; align-items: center; justify-content: space-between; gap: 10px; }
  h3 { margin: 0; }
  button { padding: 7px 10px; color: #b42318; cursor: pointer; }
  textarea { flex: 1; width: 100%; min-height: 350px; padding: 12px; resize: vertical; }
  .empty { margin: auto; color: #777; }
`;

const initialNotes = [
  { id: 1, text: 'Идеи для проекта\nДобавить поиск и удаление записей.' },
  { id: 2, text: 'Список покупок\nМолоко, хлеб, яблоки.' },
];

function getTitle(text) {
  return text.trim().split('\n')[0] || 'Новая запись';
}

export default function App() {
  const [notes, setNotes] = useState(initialNotes);
  const [activeId, setActiveId] = useState(initialNotes[0].id);
  const [query, setQuery] = useState('');

  const activeNote = notes.find((note) => note.id === activeId);
  const search = query.trim().toLowerCase();
  const filteredNotes = notes.filter((note) =>
    note.text.toLowerCase().includes(search),
  );

  function addNote() {
    const note = { id: Date.now(), text: '' };
    setNotes([note, ...notes]);
    setActiveId(note.id);
    setQuery('');
  }

  function changeNote(text) {
    setNotes(notes.map((note) =>
      note.id === activeId ? { ...note, text } : note,
    ));
  }

  function removeNote() {
    const newNotes = notes.filter((note) => note.id !== activeId);
    setNotes(newNotes);
    setActiveId(newNotes[0]?.id ?? null);
  }

  return (
    <Page>
      <h1>Блокнот</h1>

      <Notepad>
        <Sidebar>
          <div className="header">
            <h2>Записи</h2>
            <button className="add" type="button" onClick={addNote}>+</button>
          </div>

          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Поиск"
          />

          <div className="notes">
            {filteredNotes.length === 0 ? (
              <p>Ничего не найдено</p>
            ) : (
              filteredNotes.map((note) => (
                <NoteButton
                  key={note.id}
                  type="button"
                  $active={note.id === activeId}
                  onClick={() => setActiveId(note.id)}
                >
                  <strong>{getTitle(note.text)}</strong>
                  <span>{note.text.trim() || 'Пустая запись'}</span>
                </NoteButton>
              ))
            )}
          </div>
        </Sidebar>

        <Editor>
          {activeNote ? (
            <>
              <div className="header">
                <h3>{getTitle(activeNote.text)}</h3>
                <button type="button" onClick={removeNote}>Удалить</button>
              </div>
              <textarea
                value={activeNote.text}
                onChange={(event) => changeNote(event.target.value)}
                placeholder="Начните писать..."
              />
            </>
          ) : (
            <p className="empty">Записей пока нет</p>
          )}
        </Editor>
      </Notepad>
    </Page>
  );
}
