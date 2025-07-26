import { useState } from 'react';
import { supabase } from '../supabaseClient';

const UploadMedia = () => {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('');

  const handleUpload = async () => {
    const { data: { user } } = await supabase.auth.getUser();

    if (!file || !user) {
      setStatus("No file or user not logged in.");
      return;
    }

    const filePath = `${user.id}/${Date.now()}_${file.name}`;
    const { error } = await supabase.storage
      .from('user-media')
      .upload(filePath, file);

    setStatus(error ? `Error: ${error.message}` : 'File uploaded successfully.');
  };

  return (
    <div className="upload">
      <input type="file" onChange={e => setFile(e.target.files[0])} />
      <button onClick={handleUpload}>Upload</button>
      <p>{status}</p>
    </div>
  );
};

export default UploadMedia;
