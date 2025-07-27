import React, { useState, useEffect } from 'react';
import LoadingScreen from './loading.jsx';
import PreviewScreen from './preview.jsx';  



function App() {
  const [isGenerating, setIsGenerating] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsGenerating(false), 4000); // Fake delay
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="App">
      {isGenerating ? <LoadingScreen /> : <PreviewScreen />}
    </div>
  );
}

export default App;
