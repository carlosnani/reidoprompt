import { createClient } from "./client";

export async function uploadImage(file: File, bucket: string = "reidoprompt") {
  const supabase = createClient();
  
  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
  const filePath = `${fileName}`;

  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(filePath, file);

  if (error) {
    throw error;
  }

  const { data: { publicUrl } } = supabase.storage
    .from(bucket)
    .getPublicUrl(filePath);

  return { url: publicUrl, path: data.path };
}

/**
 * Extracts the storage path from a Supabase public URL.
 * URL format: https://[project-id].supabase.co/storage/v1/object/public/[bucket]/[path]
 */
export function getPathFromUrl(url: string, bucket: string = "reidoprompt"): string | null {
  try {
    const searchString = `/storage/v1/object/public/${bucket}/`;
    const index = url.indexOf(searchString);
    if (index !== -1) {
      return url.substring(index + searchString.length);
    }
    return null;
  } catch (error) {
    console.error("Error extracting path from URL:", error);
    return null;
  }
}

export async function deleteImage(pathOrUrl: string, bucket: string = "reidoprompt") {
  const supabase = createClient();
  let path = pathOrUrl;
  
  if (pathOrUrl.startsWith('http')) {
    const extractedPath = getPathFromUrl(pathOrUrl, bucket);
    if (extractedPath) {
      path = extractedPath;
    } else {
      console.warn("Could not extract path from URL:", pathOrUrl);
      return; // If it's a URL but not from our bucket/supabase, don't try to delete it
    }
  }

  const { error } = await supabase.storage.from(bucket).remove([path]);
  if (error) {
    console.error(`Error deleting image at path ${path}:`, error);
    throw error;
  }
}
