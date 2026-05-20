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

export async function deleteImage(path: string, bucket: string = "reidoprompt") {
  const supabase = createClient();
  const { error } = await supabase.storage.from(bucket).remove([path]);
  if (error) throw error;
}
