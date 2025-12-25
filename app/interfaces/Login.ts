export interface Login{
    identifier: string,
    contrasena: string
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  user_id: number;
  rol: string;
}