-- Drop existing constraints if they exist (ignore errors if they don't exist)
DO $$ 
BEGIN
    ALTER TABLE public.requests DROP CONSTRAINT IF EXISTS requests_user_id_fkey;
    ALTER TABLE public.requests DROP CONSTRAINT IF EXISTS requests_equipment_id_fkey;
    ALTER TABLE public.requests DROP CONSTRAINT IF EXISTS requests_approved_by_fkey;
EXCEPTION 
    WHEN OTHERS THEN NULL;
END $$;

-- Add missing foreign key constraints to requests table
-- These are needed for Supabase's auto-join feature to work

-- Add foreign key from requests.user_id to profiles.id
ALTER TABLE public.requests
ADD CONSTRAINT requests_user_id_fkey 
FOREIGN KEY (user_id) 
REFERENCES public.profiles(id) 
ON DELETE CASCADE;

-- Add foreign key from requests.equipment_id to equipment.id
ALTER TABLE public.requests
ADD CONSTRAINT requests_equipment_id_fkey 
FOREIGN KEY (equipment_id) 
REFERENCES public.equipment(id) 
ON DELETE CASCADE;

-- Add foreign key from requests.approved_by to profiles.id  
ALTER TABLE public.requests
ADD CONSTRAINT requests_approved_by_fkey 
FOREIGN KEY (approved_by) 
REFERENCES public.profiles(id) 
ON DELETE SET NULL;

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_requests_user_id ON public.requests(user_id);
CREATE INDEX IF NOT EXISTS idx_requests_equipment_id ON public.requests(equipment_id);
CREATE INDEX IF NOT EXISTS idx_requests_status ON public.requests(status);