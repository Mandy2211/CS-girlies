import { supabase } from '../supabaseClient';

const API_BASE = process.env.REACT_APP_API_URL || '';

async function getAuthToken() {
  // For Supabase JS v2
  if (supabase.auth.getSession) {
    const { data } = await supabase.auth.getSession();
    return data?.session?.access_token;
  }
  // For Supabase JS v1
  const session = supabase.auth.session && supabase.auth.session();
  return session?.access_token;
}

export async function generateStory({ input, mode = 'dream', tts = false }) {
  const token = await getAuthToken();
  const res = await fetch(`${API_BASE}/api/ai/generate-story`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: JSON.stringify({ input, mode, tts }),
  });
  if (!res.ok) throw new Error('Failed to generate story');
  return res.json();
}

export async function drawingToAnimation(drawingFile) {
  const token = await getAuthToken();
  const formData = new FormData();
  formData.append('drawing', drawingFile);
  const res = await fetch(`${API_BASE}/api/ai/drawing-to-animation`, {
    method: 'POST',
    body: formData,
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });
  if (!res.ok) throw new Error('Failed to generate animation');
  return res.json();
} 