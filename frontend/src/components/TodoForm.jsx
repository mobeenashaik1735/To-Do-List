import { useState } from 'react';

export default function TodoForm({ onAdd }) {
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [category, setCategory] = useState('Personal');
  const [dueDate, setDueDate] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    
    onAdd({ 
      title, 
      priority, 
      category, 
      dueDate: dueDate || new Date().toISOString().split('T')[0] 
    });
    
    setTitle('');
    setDueDate('');
  };

  return (
    <form onSubmit={handleSubmit} className="todo-form">
      <input 
        type="text" 
        placeholder="Add a new task..." 
        value={title} 
        onChange={e => setTitle(e.target.value)} 
        required 
      />
      
      <select value={priority} onChange={e => setPriority(e.target.value)} className="form-select-inline">
        <option value="High">High 🔴</option>
        <option value="Medium">Medium 🟡</option>
        <option value="Low">Low 🟢</option>
      </select>

      <select value={category} onChange={e => setCategory(e.target.value)} className="form-select-inline">
        <option value="Work">Work</option>
        <option value="Study">Study</option>
        <option value="Personal">Personal</option>
        <option value="Fitness">Fitness</option>
      </select>

      <input 
        type="date" 
        value={dueDate} 
        onChange={e => setDueDate(e.target.value)}
        className="form-date-inline"
      />

      <button type="submit" className="btn-add-task">Add</button>
    </form>
  );
}