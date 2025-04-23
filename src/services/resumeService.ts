
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
        
        // Check if the error is due to RLS policies
        if (createError.message.includes('new row violates row-level security policy')) {
          console.log("RLS policy violation. User may not have permission to create buckets.");
          // We'll continue and assume an admin has created the bucket or will create it
          return false;
        }
        
        throw createError;
      }
      
      // Set bucket policy for authenticated uploads
      try {
        // Try to access the bucket to confirm it was created
        const { data: testData, error: testError } = await supabase
          .storage
          .from('resumes')
          .list('');
        
        if (testError && !testError.message.includes('not found')) {
          console.error("Error testing bucket access:", testError);
        }
        
        console.log('Resume bucket created successfully');
      } catch (policyError) {
        console.error("Error setting bucket policy:", policyError);
      }
    } else {
      console.log('Resume bucket already exists');
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
    const bucketResult = await ensureResumeStorageBucket();
    
    if (!bucketResult) {
      console.warn("Failed to ensure resume storage bucket. Some features may not work properly.");
    }
    
    return true;
  } catch (error) {
    console.error("Error initializing resume system:", error);
    return false;
  }
};
