export interface Usuario{
    nombre: string,
    correo: string,
    rol: 'coordinador' | 'entrenador',
    contrasena: string,
    matricula: string
}