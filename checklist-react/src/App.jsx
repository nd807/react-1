import { useState } from 'react';
import styled from '@emotion/styled';

const Page = styled.main`
  max-width: 700px;
  margin: 40px auto;
  padding: 0 16px;
`;

const Card = styled.section`
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 10px;
  background: white;

  input[type='text'], button {
    padding: 8px;
    border: 1px solid #aaa;
    border-radius: 6px;
  }
`;

const AddForm = styled.form`
  display: flex;
  gap: 8px;
  margin-bottom: 16px;

  input { flex: 1; }
  button { color: white; background: #3156d3; }

  @media (max-width: 500px) {
    flex-direction: column;
  }
`;

const TaskList = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;

  li { display: flex; align-items: center; gap: 10px; padding: 12px 0; border-top: 1px solid #ddd; }
  .text { flex: 1; }
  .done { color: #777; text-decoration: line-through; }
  .actions { display: flex; gap: 6px; }
  .delete { color: #b42318; }
`;

const initialTasks = [
  { id: 1, text: 'Повторить хуки React', done: true },
  { id: 2, text: 'Сделать практическое задание', done: false },
];

export default function App() {
  const [tasks, setTasks] = useState(initialTasks);
  const [newTask, setNewTask] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState('');

  function addTask(event) {
    event.preventDefault();
    const text = newTask.trim();
    if (!text) return;

    setTasks([...tasks, { id: Date.now(), text, done: false }]);
    setNewTask('');
  }

  function toggleTask(id) {
    setTasks(tasks.map((task) =>
      task.id === id ? { ...task, done: !task.done } : task,
    ));
  }

  function removeTask(id) {
    setTasks(tasks.filter((task) => task.id !== id));
  }

  function startEditing(task) {
    setEditingId(task.id);
    setEditingText(task.text);
  }

  function saveTask(id) {
    const text = editingText.trim();
    if (!text) return;

    setTasks(tasks.map((task) =>
      task.id === id ? { ...task, text } : task,
    ));
    setEditingId(null);
    setEditingText('');
  }

  return (
    <Page>
      <h1>Чеклист</h1>

      <Card>
        <AddForm onSubmit={addTask}>
          <input
            type="text"
            value={newTask}
            onChange={(event) => setNewTask(event.target.value)}
            placeholder="Новое дело"
          />
          <button type="submit">Добавить</button>
        </AddForm>

        {tasks.length === 0 ? (
          <p>Список пуст</p>
        ) : (
          <TaskList>
            {tasks.map((task) => (
              <li key={task.id}>
                <input
                  type="checkbox"
                  checked={task.done}
                  onChange={() => toggleTask(task.id)}
                />

                {editingId === task.id ? (
                  <input
                    type="text"
                    value={editingText}
                    onChange={(event) => setEditingText(event.target.value)}
                  />
                ) : (
                  <span className={`text ${task.done ? 'done' : ''}`}>
                    {task.text}
                  </span>
                )}

                <div className="actions">
                  {editingId === task.id ? (
                    <button type="button" onClick={() => saveTask(task.id)}>
                      Сохранить
                    </button>
                  ) : (
                    <button type="button" onClick={() => startEditing(task)}>
                      Изменить
                    </button>
                  )}
                  <button className="delete" type="button" onClick={() => removeTask(task.id)}>
                    Удалить
                  </button>
                </div>
              </li>
            ))}
          </TaskList>
        )}
      </Card>
    </Page>
  );
}
