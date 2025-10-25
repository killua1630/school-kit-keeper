-- Add missing foreign key from user_roles to profiles
-- This is needed for Supabase's auto-join feature in UserManagement

-- Drop constraint if it exists
DO $$ 
BEGIN
    ALTER TABLE public.user_roles DROP CONSTRAINT IF EXISTS user_roles_user_id_fkey;
EXCEPTION 
    WHEN OTHERS THEN NULL;
END $$;

-- Add foreign key from user_roles.user_id to profiles.id
ALTER TABLE public.user_roles
ADD CONSTRAINT user_roles_user_id_fkey 
FOREIGN KEY (user_id) 
REFERENCES public.profiles(id) 
ON DELETE CASCADE;

-- Add index for better query performance
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON public.user_roles(user_id);