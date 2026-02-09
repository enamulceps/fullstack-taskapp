import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [message, setMessage] = useState('');
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');

  useEffect(() => {
    // Test backend connection
    axios.get('http://localhost:5000/api/test')
      .then(response => setMessage(response.data.message))
      .catch(error => console.error('Error:', error));
    
    // Fetch tasks
    axios.get('http://localhost:5000/api/tasks')
      .then(response => setTasks(response.data))
      .catch(error => console.error('Error fetching tasks:', error));
  }, []);

  const addTask = () => {
    if (newTask.trim() === '') return;
    
    axios.post('http://localhost:5000/api/tasks', { title: newTask })
      .then(response => {
        setTasks([...tasks, response.data]);
        setNewTask('');
      })
      .catch(error => console.error('Error adding task:', error));
  };

  const deleteTask = (id) => {
    axios.delete(`http://localhost:5000/api/tasks/${id}`)
      .then(() => {
        setTasks(tasks.filter(task => task.id !== id));
      })
      .catch(error => console.error('Error deleting task:', error));
  };
  const toggleTask = (id) => {
    axios.put(`http://localhost:5000/api/tasks/${id}`)
      .then(response => {
        setTasks(tasks.map(task => 
          task.id === id ? response.data : task
        ));
      })
      .catch(error => console.error('Error toggling task:', error));
  };

  return (
    <div className="App">
      <h1>Task Manager</h1>
      <p>Backend Status: {message || 'Connecting...'}</p>
      
      <div className="tasks-list">
        <h2>Tasks</h2>
        <div className="add-task">
          <input 
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="Enter new task..."
            onKeyPress={(e) => e.key === 'Enter' && addTask()}
          />
          <button onClick={addTask}>Add Task</button>
        </div>
        {tasks.map(task => (
          <div key={task.id} className="task-item">
            <input 
              type="checkbox" 
              checked={task.completed}
              readOnly
            />
            <span style={{ textDecoration: task.completed ? 'line-through' : 'none' }}>
              {task.title}
            </span>
            <button onClick={() => deleteTask(task.id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;