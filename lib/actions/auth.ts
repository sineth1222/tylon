"use server";

import { createClient, createAdminClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { z } from "zod";
import { sendVerificationEmail } from "@/lib/email";

const signUpSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

const signInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function signUp(formData: FormData) {
  const supabase = await createClient();
  const adminSupabase = await createAdminClient();

  const rawData = {
    fullName: formData.get("fullName") as string,
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const parsed = signUpSchema.safeParse(rawData);
  if (!parsed.success) {
    return { error: parsed.error.errors[0].message };
  }

  const { fullName, email, password } = parsed.data;

  // Check if user already exists
  const { data: existingUser } = await adminSupabase
    .from("users")
    .select("id, is_verified")
    .eq("email", email)
    .single();

  if (existingUser?.is_verified) {
    return {
      error: "An account with this email already exists. Please sign in.",
    };
  }

  // Generate verification code
  const verificationCode = generateVerificationCode();
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString();

  if (existingUser && !existingUser.is_verified) {
    // Update existing unverified user's code
    await adminSupabase
      .from("users")
      .update({
        verification_code: verificationCode,
        verification_expires_at: expiresAt,
        full_name: fullName,
      })
      .eq("email", email);
  } else {
    // Create auth user first
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
        emailRedirectTo: undefined,
      },
    });

    if (authError) {
      return { error: authError.message };
    }

    if (authData.user) {
      // Update user record with verification code
      await adminSupabase.from("users").upsert({
        id: authData.user.id,
        email,
        full_name: fullName,
        is_verified: false,
        verification_code: verificationCode,
        verification_expires_at: expiresAt,
      });
    }
  }

  // Send verification email
  try {
    await sendVerificationEmail(email, fullName, verificationCode);
  } catch (err) {
    console.error("Failed to send verification email:", err);
  }

  return {
    success: true,
    email,
    message: "Verification code sent to your email!",
  };
}

export async function verifyEmail(email: string, code: string) {
  const adminSupabase = await createAdminClient();

  const { data: user, error } = await adminSupabase
    .from("users")
    .select("*")
    .eq("email", email)
    .eq("verification_code", code)
    .single();

  if (error || !user) {
    return {
      error:
        "Verification code has Invalid or expired. Please request a new one.",
    };
  }

  if (new Date(user.verification_expires_at) < new Date()) {
    return {
      error: "Verification code has expired. Please request a new one.",
    };
  }

  // Mark as verified
  await adminSupabase
    .from("users")
    .update({
      is_verified: true,
      verification_code: null,
      verification_expires_at: null,
    })
    .eq("email", email);

  return { success: true };
}

export async function resendVerificationCode(email: string) {
  const adminSupabase = await createAdminClient();

  const { data: user } = await adminSupabase
    .from("users")
    .select("full_name")
    .eq("email", email)
    .single();

  const verificationCode = generateVerificationCode();
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString();

  await adminSupabase
    .from("users")
    .update({
      verification_code: verificationCode,
      verification_expires_at: expiresAt,
    })
    .eq("email", email);

  await sendVerificationEmail(email, user?.full_name || "", verificationCode);

  return { success: true };
}

export async function signIn(formData: FormData) {
  const supabase = await createClient();
  const adminSupabase = await createAdminClient();

  const rawData = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const parsed = signInSchema.safeParse(rawData);
  if (!parsed.success) {
    return { error: parsed.error.errors[0].message };
  }

  const { email, password } = parsed.data;

  // Check if user is verified
  const { data: userRecord } = await adminSupabase
    .from("users")
    .select("is_verified")
    .eq("email", email)
    .single();

  if (userRecord && !userRecord.is_verified) {
    return {
      error: "Please verify your email first.",
      needsVerification: true,
      email,
    };
  }

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: "Invalid email or password." };
  }

  return { success: true };
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}

export async function getUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const adminSupabase = await createAdminClient();
  const { data: profile } = await adminSupabase
    .from("users")
    .select("*")
    .eq("id", user.id)
    .single();

  return profile;
}

export async function isAdmin() {
  const user = await getUser();
  return user?.role === "admin";
}
