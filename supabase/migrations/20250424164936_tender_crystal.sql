/*
  # Create Admin User and Profile

  1. Changes
    - Create admin user in auth.users
    - Create admin profile in profiles table
    - Set up initial permissions

  2. Notes
    - Uses instance_id for proper Supabase Auth integration
    - Ensures proper foreign key relationships
*/

-- Create admin user first
DO $$
DECLARE
  new_user_id uuid := gen_random_uuid();
BEGIN
  -- Insert the admin user with explicit ID
  INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    confirmation_token,
    email_change,
    email_change_token_new,
    recovery_token
  ) VALUES (
    '00000000-0000-0000-0000-000000000000',
    new_user_id,
    'authenticated',
    'authenticated',
    'hfbc@hospital.cl',
    crypt('Hfbc7432', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"]}',
    '{"name":"Administrador HFBC","role":"admin"}',
    now(),
    now(),
    '',
    '',
    '',
    ''
  );

  -- Create the profile
  INSERT INTO public.profiles (
    id,
    email,
    name,
    role,
    created_at,
    updated_at
  ) VALUES (
    new_user_id,
    'hfbc@hospital.cl',
    'Administrador HFBC',
    'admin',
    now(),
    now()
  );

EXCEPTION WHEN unique_violation THEN
  -- User already exists, do nothing
  NULL;
END $$;