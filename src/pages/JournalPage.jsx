import React, { useState } from 'react';
import DrawingUpload from '../components/DrawingUpload';
import DreamInput from '../components/DreamInput';
import ToDoList from '../components/ToDoList';

const JournalPage = () => {
  const [dreams, setDreams] = useState([]);
  const handleDreamSend = dream => setDreams([...dreams, dream]);

  return (
    <div>
      <h1>Your Journal</h1>
      <DrawingUpload onUpload={files => alert(`Uploaded: ${files[0].name}`)} />
      <DreamInput onSend={handleDreamSend} />
      <div>
        <h3>Dreams & Stories</h3>
        <ul>
          {dreams.map((dream, idx) => (
            <li key={idx} style={{
              background: '#fff6b7',
              borderRadius: '8px',
              padding: '8px',
              marginBottom: '6px',
              color: '#222'
            }}>{dream}</li>
          ))}
        </ul>
      </div>
      <ToDoList />
    </div>
  );
};

export default JournalPage;