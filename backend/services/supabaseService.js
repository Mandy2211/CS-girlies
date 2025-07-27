const { supabase } = require('../config/database');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

class SupabaseService {
  // Save project to database
  async saveProject(projectData) {
    try {
      const { data, error } = await supabase
        .from('projects')
        .insert([{
          id: uuidv4(),
          user_id: projectData.userId,
          title: projectData.title || 'Untitled Dream',
          content: projectData.content,
          story: projectData.story,
          animation_url: projectData.animationUrl,
          audio_url: projectData.audioUrl,
          type: projectData.type || 'dream',
          status: projectData.status || 'completed',
          metadata: {
            ...(projectData.metadata || {}),
            imagePaths: projectData.imagePaths || []
          },
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) {
        console.error('Supabase save project error:', error);
        return {
          success: false,
          error: error.message
        };
      }

      return {
        success: true,
        project: data
      };
    } catch (error) {
      console.error('Supabase service error:', error);
      return {
        success: false,
        error: error.message || 'Failed to save project'
      };
    }
  }

  // Get projects for a user
  async getUserProjects(userId, limit = 50, offset = 0) {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) {
        console.error('Supabase get projects error:', error);
        return {
          success: false,
          error: error.message
        };
      }

      return {
        success: true,
        projects: data || []
      };
    } catch (error) {
      console.error('Supabase service error:', error);
      return {
        success: false,
        error: error.message || 'Failed to get projects'
      };
    }
  }

  // Get a specific project
  async getProject(projectId) {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', projectId)
        .single();

      if (error) {
        console.error('Supabase get project error:', error);
        return {
          success: false,
          error: error.message
        };
      }

      return {
        success: true,
        project: data
      };
    } catch (error) {
      console.error('Supabase service error:', error);
      return {
        success: false,
        error: error.message || 'Failed to get project'
      };
    }
  }

  // Update project
  async updateProject(projectId, updateData) {
    try {
      const { data, error } = await supabase
        .from('projects')
        .update({
          ...updateData,
          updated_at: new Date().toISOString()
        })
        .eq('id', projectId)
        .select()
        .single();

      if (error) {
        console.error('Supabase update project error:', error);
        return {
          success: false,
          error: error.message
        };
      }

      return {
        success: true,
        project: data
      };
    } catch (error) {
      console.error('Supabase service error:', error);
      return {
        success: false,
        error: error.message || 'Failed to update project'
      };
    }
  }

  // Delete project
  async deleteProject(projectId) {
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectId);

      if (error) {
        console.error('Supabase delete project error:', error);
        return {
          success: false,
          error: error.message
        };
      }

      return {
        success: true
      };
    } catch (error) {
      console.error('Supabase service error:', error);
      return {
        success: false,
        error: error.message || 'Failed to delete project'
      };
    }
  }

  // Save file metadata
  async saveFileMetadata(fileData) {
    try {
      const { data, error } = await supabase
        .from('files')
        .insert([{
          id: uuidv4(),
          user_id: fileData.userId,
          filename: fileData.filename,
          original_name: fileData.originalName,
          file_path: fileData.filePath,
          file_size: fileData.fileSize,
          mime_type: fileData.mimeType,
          uploaded_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) {
        console.error('Supabase save file error:', error);
        return {
          success: false,
          error: error.message
        };
      }

      return {
        success: true,
        file: data
      };
    } catch (error) {
      console.error('Supabase service error:', error);
      return {
        success: false,
        error: error.message || 'Failed to save file metadata'
      };
    }
  }
}

// Upload a file to Supabase Storage and return its public URL
async function uploadFileToSupabaseStorage(localFilePath, storagePath, accessToken) {
  const fileBuffer = fs.readFileSync(localFilePath);
  // Create a Supabase client with the user's access token for RLS
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_KEY,
    {
      global: {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }
    }
  );
  console.log('[DEBUG] Supabase Storage insert path:', storagePath);
  const { data, error } = await supabase.storage
    .from('images')
    .upload(storagePath, fileBuffer, { upsert: true });
  if (error) {
    console.error('[Supabase Storage] Upload (insert) error:', error);
    throw error;
  }
  // Get public URL
  let publicUrl;
  try {
    const result = supabase.storage.from('images').getPublicUrl(storagePath).data;
    publicUrl = result.publicUrl;
    if (!publicUrl) throw new Error('No public URL returned');
  } catch (selectError) {
    console.error('[Supabase Storage] getPublicUrl (select) error:', selectError);
    throw selectError;
  }
  console.log('[Supabase Storage] Public URL:', publicUrl);
  return publicUrl;
}

module.exports = Object.assign(new SupabaseService(), { uploadFileToSupabaseStorage }); 