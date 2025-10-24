-- Promote admin@gmail.com to admin role
DO $$
DECLARE
  admin_user_id uuid;
BEGIN
  -- Get the user ID from profiles
  SELECT id INTO admin_user_id 
  FROM public.profiles 
  WHERE email = 'admin@gmail.com';
  
  IF admin_user_id IS NOT NULL THEN
    -- Insert admin role (or update if exists)
    INSERT INTO public.user_roles (user_id, role)
    VALUES (admin_user_id, 'admin')
    ON CONFLICT (user_id, role) DO NOTHING;
    
    RAISE NOTICE 'User promoted to admin successfully';
  ELSE
    RAISE EXCEPTION 'User with email admin@gmail.com not found';
  END IF;
END $$;