import { supabase } from "@/supabaseClient";
import { RegisterDto } from "./types";

export async function register(dto: RegisterDto) {
  const { data, error } = await supabase.auth.signUp({
    email: dto.email,
    password: dto.senha,
    // todo nome
  });

  console.log({ data, error })

  if (error) throw error;
  return data;
}
