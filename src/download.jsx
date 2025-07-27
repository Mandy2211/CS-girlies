import React from 'react';
import './download.css';

const mockProjects = [
  {
    title: "Elara’s Dream Under Fire",
    created: "June 2025",
    length: "2 mins",
    type: "Animated Story",
    id: 1,
  },
  {
    title: "A Garden of Wishes",
    created: "May 2025",
    length: "1.5 mins",
    type: "Animation",
    id: 2,
  }
];

const DownloadPage = () => {
  return (
    <div className="download-wrapper">
      
      <div className="header-section">
  <h1 className="main-title">YOUR GALLERY</h1>
  <h2 className="subtitle" >Let's take a look back.. </h2>
  
</div>
      <div className="project-grid">
        {mockProjects.map((proj) => (
          <div key={proj.id} className="project-card">
            <h2>{proj.title}</h2>
            <p><strong>Created:</strong> {proj.created}</p>
            <p><strong>Length:</strong> {proj.length}</p>
            
            <div className="button-row">
              <button>View</button>
              <button>Edit</button>
              <button>Download</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DownloadPage;


// made a basic download page- it can use way more styling and features, but this is a start.
// we can edit as we proced with intergrating the backend and other features.