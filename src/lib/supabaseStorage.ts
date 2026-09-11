import { supabase, isSupabaseConfigured } from './supabase';

export type MediaFolder = 'posts' | 'stories' | 'reels' | 'avatars' | 'audio' | 'messages';

/**
 * Uploads a file/blob to the Supabase Storage 'media' bucket.
 * If Supabase is configured and connected, stores into the bucket and returns the permanent public CDN URL.
 * If offline or not configured, falls back smoothly to an object URL so the app always functions smoothly.
 */
export async function uploadMediaToSupabase(
  file: File | Blob,
  folder: MediaFolder = 'posts',
  customFileName?: string,
  userId?: string
): Promise<{ url: string; path?: string; error?: string }> {
  // If not configured, provide object URL fallback
  if (!isSupabaseConfigured) {
    const objectUrl = URL.createObjectURL(file);
    return { url: objectUrl };
  }

  try {
    const ext = file instanceof File ? file.name.split('.').pop() || 'jpg' : 'jpg';
    const cleanFileName = customFileName
      ? `${customFileName}.${ext}`
      : `${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${ext}`;

    const userPrefix = userId || 'anonymous';
    const filePath = `${userPrefix}/${folder}/${cleanFileName}`;

    const { data, error } = await supabase.storage
      .from('media')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true
      });

    if (error) {
      console.warn('Supabase storage upload notice:', error.message);
      // Fallback to local URL on upload error so user's post flow is not interrupted
      return { url: URL.createObjectURL(file), error: error.message };
    }

    const { data: publicData } = supabase.storage
      .from('media')
      .getPublicUrl(data.path);

    return { url: publicData.publicUrl, path: data.path };
  } catch (err: any) {
    console.warn('Error during Supabase media upload:', err);
    return { url: URL.createObjectURL(file), error: err?.message || 'Upload failed' };
  }
}

/**
 * Removes a file from the Supabase Storage 'media' bucket by path.
 */
export async function deleteMediaFromSupabase(filePath: string): Promise<boolean> {
  if (!isSupabaseConfigured || !filePath) return true;

  try {
    const { error } = await supabase.storage.from('media').remove([filePath]);
    if (error) {
      console.warn('Supabase storage delete notice:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('Error deleting media from Supabase:', err);
    return false;
  }
}
