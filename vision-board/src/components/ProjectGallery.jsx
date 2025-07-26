import React, { useEffect, useState } from 'react'; // Added React import
import { supabase } from '../supabaseClient';
import { useAuth } from '../Context/AuthContext';

const ProjectGallery = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editedContent, setEditedContent] = useState('');

  useEffect(() => {
    const fetchProjects = async () => {
      if (!user) return;
      
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (!error) setProjects(data || []);
    };

    fetchProjects();
  }, [user]);

  const handleSaveEdit = async (projectId) => {
    const { error } = await supabase
      .from('projects')
      .update({ content: editedContent })
      .eq('id', projectId);
    
    if (!error) {
      setProjects(projects.map(proj => 
        proj.id === projectId ? { ...proj, content: editedContent } : proj
      ));
      setEditingId(null);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.length === 0 ? (
        <div className="col-span-full text-center py-12">
          <div className="text-indigo-400 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <h3 className="text-xl font-medium text-gray-700">No projects yet</h3>
          <p className="text-gray-500 mt-2">Create your first dream project!</p>
        </div>
      ) : (
        projects.map(project => (
          <div key={project.id} className="bg-white rounded-xl shadow-lg overflow-hidden transition-transform hover:scale-[1.02]">
            <div className="p-5">
              <div className="flex justify-between items-start">
                <h3 className="font-semibold text-indigo-700 capitalize">
                  {project.type}
                </h3>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => {
                      setEditingId(project.id);
                      setEditedContent(project.content);
                    }}
                    className="text-indigo-500 hover:text-indigo-700"
                  >
                    ✏️
                  </button>
                </div>
              </div>
              
              {editingId === project.id ? (
                <div className="mt-3">
                  <textarea
                    value={editedContent}
                    onChange={(e) => setEditedContent(e.target.value)}
                    className="w-full p-2 border rounded-lg"
                    rows={3}
                  />
                  <div className="flex space-x-2 mt-2">
                    <button
                      onClick={() => handleSaveEdit(project.id)}
                      className="px-3 py-1 bg-indigo-600 text-white rounded-lg text-sm"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="px-3 py-1 bg-gray-200 rounded-lg text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <p className="mt-3 text-gray-600 whitespace-pre-line">
                  {project.content}
                </p>
              )}
              
              <div className="mt-4 text-sm text-gray-500">
                {new Date(project.created_at).toLocaleDateString()}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default ProjectGallery;