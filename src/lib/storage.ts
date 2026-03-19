import "server-only";

import { createClient } from "@supabase/supabase-js";

function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

  if (!supabaseUrl) {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL is not set");
  }

  if (!supabaseServiceKey) {
    throw new Error("SUPABASE_SERVICE_KEY is not set");
  }

  return createClient(supabaseUrl, supabaseServiceKey);
}

export async function uploadFile(file: File, path: string) {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase.storage
    .from("attachments")
    .upload(path, file, {
      cacheControl: "3600",
      upsert: false,
      contentType: file.type,
    });

  if (error) {
    throw error;
  }

  const { data: urlData } = supabase.storage
    .from("attachments")
    .getPublicUrl(data.path);

  return urlData.publicUrl;
}

export async function deleteFile(path: string) {
  const supabase = getSupabaseClient();

  const { error } = await supabase.storage.from("attachments").remove([path]);

  if (error) {
    throw error;
  }
}
