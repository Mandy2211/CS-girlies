import { useState, useRef } from 'react';

const UploadSection = ({ onProcessingStart }) => {
  const [dreamInput, setDreamInput] = useState('');
  const [files, setFiles] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const newFiles = Array.from(e.dataTransfer.files).filter(file => 
        ['image/png', 'image/jpeg', 'image/jpg'].includes(file.type)
      );
      
      if (newFiles.length > 0) {
        setFiles(newFiles.map(file => Object.assign(file, {
          preview: URL.createObjectURL(file)
        })));
      }
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      const newFiles = Array.from(e.target.files).filter(file => 
        ['image/png', 'image/jpeg', 'image/jpg'].includes(file.type)
      );
      
      if (newFiles.length > 0) {
        setFiles(newFiles.map(file => Object.assign(file, {
          preview: URL.createObjectURL(file)
        })));
      }
    }
  };

  const handleSubmit = async () => {
    if (!dreamInput.trim() && files.length === 0) return;
    
    onProcessingStart();
    setIsGenerating(true);
    
    try {
      // API integration would go here
      // await generateStoryAndAnimation(dreamInput, files);
      
      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 3000));
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Describe Your Dream</h2>
        <textarea
          value={dreamInput}
          onChange={(e) => setDreamInput(e.target.value)}
          placeholder="I dreamed about flying cats wearing astronaut helmets..."
          className="w-full h-40 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Or Upload a Drawing</h2>
        <div 
          className={`border-2 rounded-lg p-8 text-center cursor-pointer transition-colors
            ${dragActive ? 'border-indigo-400 bg-indigo-50' : 'border-dashed border-gray-300'}`}
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current.click()}
        >
          <input 
            ref={fileInputRef}
            type="file" 
            onChange={handleChange} 
            className="hidden" 
            accept="image/png, image/jpeg, image/jpg"
          />
          <div className="flex flex-col items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            <p className="mt-4 text-gray-600">Click or drag files to upload</p>
            <p className="text-sm text-gray-500 mt-1">PNG, JPG up to 10MB</p>
          </div>
        </div>

        {files.length > 0 && (
          <div className="mt-4">
            <h3 className="font-medium text-gray-700">Preview:</h3>
            <div className="flex flex-wrap gap-2 mt-2">
              {files.map(file => (
                <div key={file.name} className="relative">
                  <img
                    src={file.preview}
                    alt={file.name}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="lg:col-span-2 flex justify-center mt-4">
        <button
          onClick={handleSubmit}
          disabled={isGenerating || (!dreamInput.trim() && files.length === 0)}
          className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-3 px-8 rounded-full text-lg shadow-lg transition-all duration-300 disabled:opacity-50"
        >
          {isGenerating ? 'Creating Magic...' : 'Bring My Dream to Life'}
        </button>
      </div>
    </div>
  );
};

export default UploadSection;