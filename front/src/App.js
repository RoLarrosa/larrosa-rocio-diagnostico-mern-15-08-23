
import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTaskText, setNewTaskText] = useState('');
  const [newDes, setNewDesc] = useState('');

  useEffect(() => {
    fetch('http://localhost:5000/Tasks')
      .then(response => response.json())
      .then(data => setTasks(data));
  }, []);

  const addTask = () => {
    if (newTaskText) {
      fetch('http://localhost:5000/Tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ titulo: newTaskText,
         descripcion: newDes}),
      })
        .then(response => response.json())
        .then(data => {
          setTasks([...tasks, data]);
          setNewTaskText('');
          setNewDesc('');
        });
    }
  };

  const toggleTaskCompletion = id => {
    fetch(`http://localhost:5000/tasks/${id}`, {
      method: 'PUT',
    })
      .then(response => response.json())
      .then(updatedTask => {
        const updatedTasks = tasks.map(task =>
          task._id === updatedTask._id ? updatedTask : task
        );
        setTasks(updatedTasks);
      });
  };

  const deleteTask = id => {
    fetch(`http://localhost:5000/tasks/${id}`, {
      method: 'DELETE',
    })
      .then(response => response.json())
      .then(() => {
        const updatedTasks = tasks.filter(task => task._id !== id);
        setTasks(updatedTasks);
      });
  };

  return (
    <div className="App">
      <h1>ToDo List</h1>
      <div>
        <input
          type="text"
          value={newTaskText}
          onChange={e => setNewTaskText(e.target.value)}
          placeholder="Escribe una tarea..."
        />
        <input
          type="text"
          value={newDes}
          onChange={e => setNewDesc(e.target.value)}
          placeholder="Descripcion "
        />
        <button onClick={addTask}>Agregar</button>
      </div>
      <ul>
        {tasks.map(task => (
          <li key={task._id}>
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => toggleTaskCompletion(task._id)}
            />
            <span className={task.completed ? 'completed' : ''}>{task.titulo}</span>
            <br/>
            <span>{task.descripcion}</span>

            <button onClick={() => deleteTask(task._id)}>Borrar</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
