"use server";

import { createAdminClient, createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export type Speech = {
  id: string;
  title: string;
  excerpt: string;
  body: string;
  image_url: string | null;
  is_active: boolean;
  created_at: string;
  like_count?: number;
  user_liked?: boolean;
};

// ── PUBLIC: get all active speeches with like counts ──────────────────────────
export async function getSpeeches(userEmail?: string): Promise<Speech[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("motivational_speeches")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  if (error || !data) return [];

  // Get like counts for all speeches
  const ids = data.map((s) => s.id);
  const { data: likes } = await supabase
    .from("speech_likes")
    .select("speech_id, user_email")
    .in("speech_id", ids);

  return data.map((speech) => {
    const speechLikes = likes?.filter((l) => l.speech_id === speech.id) ?? [];
    return {
      ...speech,
      like_count: speechLikes.length,
      user_liked: userEmail
        ? speechLikes.some((l) => l.user_email === userEmail)
        : false,
    };
  });
}

// ── PUBLIC: get single speech ─────────────────────────────────────────────────
export async function getSpeechById(
  id: string,
  userEmail?: string,
): Promise<Speech | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("motivational_speeches")
    .select("*")
    .eq("id", id)
    .eq("is_active", true)
    .single();

  if (error || !data) return null;

  const { data: likes } = await supabase
    .from("speech_likes")
    .select("user_email")
    .eq("speech_id", id);

  return {
    ...data,
    like_count: likes?.length ?? 0,
    user_liked: userEmail
      ? (likes?.some((l) => l.user_email === userEmail) ?? false)
      : false,
  };
}

// ── PUBLIC: toggle like (requires email) ──────────────────────────────────────
export async function toggleSpeechLike(
  speechId: string,
  userEmail: string,
): Promise<{ liked: boolean; count: number }> {
  const supabase = await createAdminClient();

  // Check if already liked
  const { data: existing } = await supabase
    .from("speech_likes")
    .select("id")
    .eq("speech_id", speechId)
    .eq("user_email", userEmail)
    .single();

  if (existing) {
    // Unlike
    await supabase
      .from("speech_likes")
      .delete()
      .eq("speech_id", speechId)
      .eq("user_email", userEmail);
  } else {
    // Like
    await supabase
      .from("speech_likes")
      .insert({ speech_id: speechId, user_email: userEmail });
  }

  // Get updated count
  const { count } = await supabase
    .from("speech_likes")
    .select("*", { count: "exact", head: true })
    .eq("speech_id", speechId);

  revalidatePath("/");
  return { liked: !existing, count: count ?? 0 };
}

// ── ADMIN: get all speeches ───────────────────────────────────────────────────
export async function adminGetSpeeches(): Promise<Speech[]> {
  const supabase = await createAdminClient();
  const { data, error } = await supabase
    .from("motivational_speeches")
    .select("*")
    .order("created_at", { ascending: false });

  if (error || !data) return [];

  const { data: likes } = await supabase
    .from("speech_likes")
    .select("speech_id");

  return data.map((s) => ({
    ...s,
    like_count: likes?.filter((l) => l.speech_id === s.id).length ?? 0,
  }));
}

// ── ADMIN: create speech ──────────────────────────────────────────────────────
export async function adminCreateSpeech(formData: FormData) {
  const supabase = await createAdminClient();

  const payload = {
    title: formData.get("title") as string,
    excerpt: formData.get("excerpt") as string,
    body: formData.get("body") as string,
    image_url: (formData.get("image_url") as string) || null,
    is_active: formData.get("is_active") === "true",
  };

  const { error } = await supabase
    .from("motivational_speeches")
    .insert(payload);

  if (error) return { error: error.message };
  revalidatePath("/admin/speeches");
  revalidatePath("/");
  return { success: true };
}

// ── ADMIN: update speech ──────────────────────────────────────────────────────
export async function adminUpdateSpeech(id: string, formData: FormData) {
  const supabase = await createAdminClient();

  const payload = {
    title: formData.get("title") as string,
    excerpt: formData.get("excerpt") as string,
    body: formData.get("body") as string,
    image_url: (formData.get("image_url") as string) || null,
    is_active: formData.get("is_active") === "true",
    updated_at: new Date().toISOString(),
  };

  const { error } = await supabase
    .from("motivational_speeches")
    .update(payload)
    .eq("id", id);

  if (error) return { error: error.message };
  revalidatePath("/admin/speeches");
  revalidatePath("/");
  return { success: true };
}

// ── ADMIN: delete speech ──────────────────────────────────────────────────────
export async function adminDeleteSpeech(id: string) {
  const supabase = await createAdminClient();
  const { error } = await supabase
    .from("motivational_speeches")
    .delete()
    .eq("id", id);

  if (error) return { error: error.message };
  revalidatePath("/admin/speeches");
  revalidatePath("/");
  return { success: true };
}

// ── ADMIN: toggle active ──────────────────────────────────────────────────────
export async function adminToggleSpeechActive(id: string, active: boolean) {
  const supabase = await createAdminClient();
  await supabase
    .from("motivational_speeches")
    .update({ is_active: active })
    .eq("id", id);

  revalidatePath("/admin/speeches");
  revalidatePath("/");
}
