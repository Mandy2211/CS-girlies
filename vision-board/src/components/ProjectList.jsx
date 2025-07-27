import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

const ProjectList = () => {
  const [projects, setProjects] = useState([]);
  const [files, setFiles] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: projData } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      const { data: fileData } = await supabase
        .storage
        .from('user-media')
        .list(user.id + '/', { limit: 100 });

      setProjects(projData || []);
      setFiles(fileData || []);
    };

    fetchData();
  }, []);

  return (
    <div>
      <h2>My Projects</h2>
      <ul>
        {projects.map(p => (
          <li key={p.id}>
            <strong>{p.type}</strong>: {JSON.stringify(p.content)}
          </li>
        ))}
      </ul>

      <h2>My Files</h2>
      <ul>
        {files.map(file => (
          <li key={file.name}>
            <a
              href={supabase.storage
                .from('user-media')
                .getPublicUrl(user.id + '/' + file.name).data.publicUrl}
              target="_blank" rel="noopener noreferrer"
            >
              {file.name}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProjectList;
