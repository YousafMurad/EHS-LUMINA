"use server";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export type UploadResult = {
  success: boolean;
  url?: string;
  error?: string;
};

/**
 * Upload an image to Supabase Storage
 */
export async function uploadImage(
  formData: FormData,
  bucket: string = "images",
  folder: string = ""
): Promise<UploadResult> {
  try {
    const supabase = await createServerSupabaseClient();
    
    const file = formData.get("file") as File;
    if (!file) {
      return { success: false, error: "No file provided" };
    }

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp", "image/svg+xml"];
    if (!allowedTypes.includes(file.type)) {
      return { success: false, error: "Invalid file type. Allowed: JPG, PNG, GIF, WebP, SVG" };
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return { success: false, error: "File size must be less than 5MB" };
    }

    // Generate unique filename
    const fileExt = file.name.split(".").pop();
    const fileName = `${folder ? folder + "/" : ""}${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(fileName, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      console.error("Upload error:", error);
      return { success: false, error: error.message };
    }

    // Get public URL
    const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(data.path);

    return { success: true, url: urlData.publicUrl };
  } catch (error) {
    console.error("Upload error:", error);
    return { success: false, error: "Failed to upload image" };
  }
}

/**
 * Upload student photo
 */
export async function uploadStudentPhoto(formData: FormData, studentId: string): Promise<UploadResult> {
  const result = await uploadImage(formData, "students", `photos/${studentId}`);
  
  if (result.success && result.url) {
    // Update student record with new photo URL
    const supabase = await createServerSupabaseClient();
    const { error } = await supabase
      .from("students")
      .update({ photo_url: result.url })
      .eq("id", studentId);
    
    if (error) {
      console.error("Error updating student photo URL:", error);
      return { success: false, error: "Failed to update student record" };
    }
  }
  
  return result;
}

/**
 * Upload school logo
 */
export async function uploadSchoolLogo(formData: FormData): Promise<UploadResult> {
  const result = await uploadImage(formData, "settings", "logo");
  
  if (result.success && result.url) {
    // Save logo URL to settings table
    const supabase = await createServerSupabaseClient();
    
    console.log("Logo uploaded successfully, URL:", result.url);
    
    // Check if settings row exists
    const { data: existing, error: selectError } = await supabase
      .from("settings")
      .select("id, logo_url")
      .limit(1)
      .maybeSingle();

    if (selectError) {
      console.error("Error checking settings:", selectError);
    }

    if (existing) {
      // Update existing
      console.log("Updating existing settings row with logo_url");
      const { error: updateError } = await supabase
        .from("settings")
        .update({ logo_url: result.url })
        .eq("id", existing.id);
      
      if (updateError) {
        console.error("Error updating logo_url:", updateError);
        // If column doesn't exist, the error will show here
        return { ...result, error: `Logo uploaded but failed to save: ${updateError.message}` };
      } else {
        console.log("Logo URL saved successfully to settings table");
      }
    } else {
      // Insert new with defaults
      console.log("Creating new settings row with logo_url");
      const { error: insertError } = await supabase.from("settings").insert({
        school_name: "EHS School",
        tagline: "Excellence in Education",
        logo_url: result.url,
      });
      
      if (insertError) {
        console.error("Error inserting settings with logo:", insertError);
        return { ...result, error: `Logo uploaded but failed to save: ${insertError.message}` };
      }
    }
    
    // Revalidate all paths to refresh the sidebar
    revalidatePath("/", "layout");
    revalidatePath("/dashboard", "layout");
    revalidatePath("/settings", "layout");
  }
  
  return result;
}

/**
 * Upload teacher photo
 */
export async function uploadTeacherPhoto(formData: FormData, teacherId: string): Promise<UploadResult> {
  const result = await uploadImage(formData, "teachers", `photos/${teacherId}`);
  
  if (result.success && result.url) {
    const supabase = await createServerSupabaseClient();
    const { error } = await supabase
      .from("teachers")
      .update({ photo_url: result.url })
      .eq("id", teacherId);
    
    if (error) {
      console.error("Error updating teacher photo URL:", error);
      return { success: false, error: "Failed to update teacher record" };
    }
  }
  
  return result;
}

/**
 * Delete an image from Supabase Storage
 */
export async function deleteImage(path: string, bucket: string = "images"): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createServerSupabaseClient();
    
    const { error } = await supabase.storage.from(bucket).remove([path]);
    
    if (error) {
      return { success: false, error: error.message };
    }
    
    return { success: true };
  } catch (error) {
    console.error("Delete error:", error);
    return { success: false, error: "Failed to delete image" };
  }
}
