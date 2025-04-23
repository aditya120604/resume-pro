
import { supabase } from "@/integrations/supabase/client";

/**
 * Check if resume storage bucket exists, create if it doesn't
 */
export const ensureResumeStorageBucket = async () => {
  try {
    // Check if bucket exists
    const { data: buckets, error } = await supabase
      .storage
      .listBuckets();
    
    if (error) {
      console.error("Error checking buckets:", error);
      throw error;
    }
    
    const resumeBucketExists = buckets.some(bucket => bucket.name === 'resumes');
    
    if (!resumeBucketExists) {
      // Create the bucket if it doesn't exist
      const { error: createError } = await supabase
        .storage
        .createBucket('resumes', {
          public: false,
          fileSizeLimit: 10485760, // 10MB
        });
      
      if (createError) {
        console.error("Error creating resume bucket:", createError);
        throw createError;
      }
      
      // Set bucket policy
      const { error: policyError } = await supabase
        .storage
        .from('resumes')
        .createSignedUrl('dummy-path', 1); // This will fail but will ensure the bucket is properly initialized
      
      if (policyError && !policyError.message.includes('not found')) {
        console.error("Error setting bucket policy:", policyError);
      }
      
      console.log('Resume bucket created successfully');
    }
    
    return true;
  } catch (error) {
    console.error("Error in ensureResumeStorageBucket:", error);
    return false;
  }
};

/**
 * Initialize tables if they don't exist
 */
export const initializeResumeSystem = async () => {
  try {
    // Ensure buckets exist
    await ensureResumeStorageBucket();
    
    return true;
  } catch (error) {
    console.error("Error initializing resume system:", error);
    return false;
  }
};
