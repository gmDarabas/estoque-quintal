import { Usuario } from "@/features/admin/usuarios/api/types";

export type AccessTokenDto = {
  accessToken: string;
  usuario: Usuario;
};

export type SignInDto = {
  email: string;
  senha: string;
};

export type RegisterDto = {
  email: string;
  nome: string;
  senha: string;
};
