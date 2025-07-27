import React, { useState } from 'react';

const ToDoList = () => {
  const [items, setItems] = useState([]);
  const [input, setInput] = useState('');

  const addItem = () => {
    if (input.trim()) {
      setItems([...items, input.trim()]);
      setInput('');
    }
  };

  return (
    <div style={{
      background: '#fff',
      borderRadius: '18px',
      boxShadow: '0 2px 12px #b6e2d3',
      padding: '24px',
      marginBottom: '24px'
    }}>
      <h3 style={{ color: '#3a4ca8', fontFamily: 'Pacifico, cursive' }}>To-Do List</h3>
      <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Add a task..."
          style={{
            flex: 1,
            borderRadius: '8px',
            border: '1px solid #a7bfff',
            padding: '8px',
            fontSize: '1rem'
          }}
        />
        <button
          onClick={addItem}
          style={{
            padding: '8px 16px',
            borderRadius: '8px',
            background: 'linear-gradient(90deg, #b6e2d3, #fff6b7)',
            color: '#222',
            border: 'none',
            cursor: 'pointer',
            fontWeight: '600'
          }}
        >
          Add
        </button>
      </div>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {items.map((item, idx) => (
          <li key={idx} style={{
            background: '#f7c6e0',
            borderRadius: '8px',
            padding: '8px',
            marginBottom: '6px',
            color: '#222'
          }}>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ToDoList;