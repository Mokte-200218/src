export interface Usuario{
    id: number;
    nombre: string,
    correo: string,
    rol: 'coordinador' | 'coach',
    contrasena: string,
    matricula: string
}
export interface UsuarioResponse {
  id: number;
  nombre: string;
  correo: string;
  rol: 'coordinador' | 'coach';
}

export interface usuarioid {
  nombre: string;
  correo: string;
  rol: 'coordinador' | 'coach'
  id: 0,
  matricula: string,
  fecha_creacion: Date
}