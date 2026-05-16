import { supabase } from "@/supabaseClient";

export async function login({ email, senha }: { email: string; senha: string }) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password: senha,
  });

  if (error) throw error;
  return data;
}

